import re
from typing import Any

import numpy as np
import pandas as pd


def normalize_column_name(value: str) -> str:
    """
    Convert CSV headers into lowercase underscore format.

    Examples:
        Diet_type   -> diet_type
        Protein(g)  -> protein_g
        Carbs(g)    -> carbs_g
    """
    normalized = str(value).strip().lower()

    normalized = re.sub(
        r"[^a-z0-9]+",
        "_",
        normalized
    )

    return normalized.strip("_")


def standardize_columns(
    dataframe: pd.DataFrame
) -> pd.DataFrame:
    """
    Rename columns from All_Diets.csv into names used by the API.
    """
    dataframe = dataframe.copy()

    dataframe.columns = [
        normalize_column_name(column)
        for column in dataframe.columns
    ]

    rename_map = {
        "diet_type": "diet_type",
        "recipe_name": "food",
        "cuisine_type": "cuisine",
        "protein_g": "protein",
        "carbs_g": "carbohydrates",
        "fat_g": "fat",
        "extraction_day": "extraction_day",
        "extraction_time": "extraction_time"
    }

    dataframe = dataframe.rename(columns=rename_map)

    return dataframe


def convert_numeric_columns(
    dataframe: pd.DataFrame
) -> pd.DataFrame:
    """
    Convert nutrition columns into numbers.
    """
    dataframe = dataframe.copy()

    numeric_columns = [
        "protein",
        "carbohydrates",
        "fat"
    ]

    for column in numeric_columns:
        if column not in dataframe.columns:
            continue

        dataframe[column] = pd.to_numeric(
            dataframe[column],
            errors="coerce"
        ).fillna(0)

    return dataframe


def calculate_estimated_calories(
    dataframe: pd.DataFrame
) -> pd.DataFrame:
    """
    Estimate calories using the standard macronutrient formula:

    Protein:      4 calories per gram
    Carbohydrate: 4 calories per gram
    Fat:          9 calories per gram
    """
    dataframe = dataframe.copy()

    dataframe["calories"] = (
        dataframe["protein"] * 4
        + dataframe["carbohydrates"] * 4
        + dataframe["fat"] * 9
    ).round(2)

    return dataframe


def safe_float(value: Any) -> float:
    """
    Convert pandas and NumPy values into JSON-safe floats.
    """
    if value is None or pd.isna(value):
        return 0.0

    return round(float(value), 2)


def safe_records(
    dataframe: pd.DataFrame
) -> list[dict[str, Any]]:
    """
    Convert a DataFrame into JSON-safe records.
    """
    safe_dataframe = dataframe.copy()

    safe_dataframe = safe_dataframe.replace(
        [np.inf, -np.inf],
        np.nan
    )

    safe_dataframe = safe_dataframe.where(
        pd.notnull(safe_dataframe),
        None
    )

    return safe_dataframe.to_dict(
        orient="records"
    )


def create_heatmap(
    dataframe: pd.DataFrame,
    nutrient_columns: list[str]
) -> list[dict[str, Any]]:
    """
    Create nutrient correlation data for the heatmap.
    """
    correlation_matrix = (
        dataframe[nutrient_columns]
        .corr()
        .fillna(0)
        .round(2)
    )

    heatmap: list[dict[str, Any]] = []

    for row_nutrient in correlation_matrix.index:
        for column_nutrient in correlation_matrix.columns:
            heatmap.append(
                {
                    "x": column_nutrient,
                    "y": row_nutrient,
                    "value": safe_float(
                        correlation_matrix.loc[
                            row_nutrient,
                            column_nutrient
                        ]
                    )
                }
            )

    return heatmap


def create_nutrition_analysis(
    dataframe: pd.DataFrame
) -> dict[str, Any]:
    """
    Clean and analyze the All_Diets CSV dataset.

    Returns data for:
        - Summary cards
        - Bar chart
        - Scatter plot
        - Heatmap
        - Pie chart
        - Dataset table
    """
    if dataframe.empty:
        raise ValueError(
            "The nutrition dataset is empty."
        )

    dataframe = standardize_columns(dataframe)

    required_columns = [
        "diet_type",
        "food",
        "cuisine",
        "protein",
        "carbohydrates",
        "fat"
    ]

    missing_columns = [
        column
        for column in required_columns
        if column not in dataframe.columns
    ]

    if missing_columns:
        raise ValueError(
            "Dataset is missing required columns: "
            + ", ".join(missing_columns)
            + ". Available columns are: "
            + ", ".join(dataframe.columns.tolist())
        )

    dataframe = convert_numeric_columns(dataframe)
    dataframe = calculate_estimated_calories(dataframe)

    dataframe["diet_type"] = (
        dataframe["diet_type"]
        .fillna("Unknown")
        .astype(str)
        .str.strip()
    )

    dataframe["food"] = (
        dataframe["food"]
        .fillna("Unknown recipe")
        .astype(str)
        .str.strip()
    )

    dataframe["cuisine"] = (
        dataframe["cuisine"]
        .fillna("Unknown")
        .astype(str)
        .str.strip()
    )

    nutrient_columns = [
        "protein",
        "carbohydrates",
        "fat",
        "calories"
    ]

    # Average nutrients grouped by diet.
    by_diet_dataframe = (
        dataframe
        .groupby(
            "diet_type",
            as_index=False
        )[nutrient_columns]
        .mean()
        .round(2)
        .rename(
            columns={
                "diet_type": "diet"
            }
        )
        .sort_values(
            by="calories",
            ascending=False
        )
    )

    # Average estimated calories grouped by diet.
    calories_pie_dataframe = (
        dataframe
        .groupby(
            "diet_type",
            as_index=False
        )["calories"]
        .mean()
        .round(2)
        .rename(
            columns={
                "diet_type": "name",
                "calories": "value"
            }
        )
        .sort_values(
            by="value",
            ascending=False
        )
    )

    # Protein versus estimated calories scatter plot.
    scatter_dataframe = (
        dataframe[
            [
                "food",
                "diet_type",
                "cuisine",
                "protein",
                "calories"
            ]
        ]
        .rename(
            columns={
                "diet_type": "diet",
                "protein": "x",
                "calories": "y"
            }
        )
        .round(2)
        .head(1000)
    )

    heatmap = create_heatmap(
        dataframe,
        nutrient_columns
    )

    # Average nutrition grouped by cuisine.
    by_cuisine_dataframe = (
        dataframe
        .groupby(
            "cuisine",
            as_index=False
        )[nutrient_columns]
        .mean()
        .round(2)
        .sort_values(
            by="calories",
            ascending=False
        )
    )

    # Top recipes by estimated calories.
    top_recipes_dataframe = (
        dataframe[
            [
                "food",
                "diet_type",
                "cuisine",
                "protein",
                "carbohydrates",
                "fat",
                "calories"
            ]
        ]
        .nlargest(
            10,
            "calories"
        )
        .round(2)
    )

    summary = {
        "totalFoods": int(len(dataframe)),
        "totalDiets": int(
            dataframe["diet_type"].nunique()
        ),
        "totalCuisines": int(
            dataframe["cuisine"].nunique()
        ),
        "averageCalories": safe_float(
            dataframe["calories"].mean()
        ),
        "averageProtein": safe_float(
            dataframe["protein"].mean()
        ),
        "averageCarbohydrates": safe_float(
            dataframe["carbohydrates"].mean()
        ),
        "averageFat": safe_float(
            dataframe["fat"].mean()
        ),
        "highestCalories": safe_float(
            dataframe["calories"].max()
        ),
        "highestProtein": safe_float(
            dataframe["protein"].max()
        )
    }

    table_columns = [
        "food",
        "diet_type",
        "cuisine",
        "protein",
        "carbohydrates",
        "fat",
        "calories"
    ]

    if "extraction_day" in dataframe.columns:
        table_columns.append(
            "extraction_day"
        )

    if "extraction_time" in dataframe.columns:
        table_columns.append(
            "extraction_time"
        )

    table_dataframe = (
        dataframe[table_columns]
        .head(100)
        .round(2)
    )

    return {
        "summary": summary,

        # Existing frontend chart properties.
        "byDiet": safe_records(
            by_diet_dataframe
        ),
        "scatter": safe_records(
            scatter_dataframe
        ),
        "heatmap": heatmap,
        "caloriesPie": safe_records(
            calories_pie_dataframe
        ),

        # Additional useful chart data.
        "byCuisine": safe_records(
            by_cuisine_dataframe
        ),
        "topRecipes": safe_records(
            top_recipes_dataframe
        ),

        "table": safe_records(
            table_dataframe
        ),

        "metadata": {
            "rows": int(len(dataframe)),
            "columns": dataframe.columns.tolist(),
            "nutrients": nutrient_columns,
            "caloriesAreEstimated": True,
            "calorieFormula": (
                "(protein × 4) + "
                "(carbohydrates × 4) + "
                "(fat × 9)"
            )
        }
    }