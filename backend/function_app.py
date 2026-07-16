import json
import logging
from datetime import datetime, timezone
from typing import Any

import azure.functions as func

from blob_storage import download_nutrition_csv
from data_analysis import create_nutrition_analysis


app = func.FunctionApp(
    http_auth_level=func.AuthLevel.ANONYMOUS
)


def json_response(
    body: dict[str, Any],
    status_code: int = 200
) -> func.HttpResponse:
    return func.HttpResponse(
        body=json.dumps(
            body,
            ensure_ascii=False,
            default=str
        ),
        status_code=status_code,
        mimetype="application/json",
        headers={
            "Cache-Control": "no-store"
        }
    )


@app.route(
    route="health",
    methods=["GET"]
)
def health(
    req: func.HttpRequest
) -> func.HttpResponse:
    return json_response(
        {
            "success": True,
            "status": "healthy",
            "service": "nutrition-analysis-api",
            "timestamp": datetime.now(
                timezone.utc
            ).isoformat()
        }
    )


@app.route(
    route="nutrition-analysis",
    methods=["GET", "OPTIONS"]
)
def nutrition_analysis(
    req: func.HttpRequest
) -> func.HttpResponse:
    logging.info(
        "Nutrition analysis HTTP endpoint called."
    )

    if req.method == "OPTIONS":
        return func.HttpResponse(
            status_code=204
        )

    try:
        dataframe = download_nutrition_csv()

        analysis = create_nutrition_analysis(
            dataframe
        )

        return json_response(
            {
                "success": True,
                "message": (
                    "Nutrition analysis generated successfully."
                ),
                "generatedAt": datetime.now(
                    timezone.utc
                ).isoformat(),
                "data": analysis
            }
        )

    except FileNotFoundError as error:
        logging.exception("Nutrition blob was not found.")

        return json_response(
            {
                "success": False,
                "error": "Dataset not found.",
                "details": str(error)
            },
            status_code=404
        )

    except ValueError as error:
        logging.exception(
            "Dataset validation failed."
        )

        return json_response(
            {
                "success": False,
                "error": "Invalid nutrition dataset.",
                "details": str(error)
            },
            status_code=400
        )

    except RuntimeError as error:
        logging.exception(
            "Blob Storage operation failed."
        )

        return json_response(
            {
                "success": False,
                "error": (
                    "Could not retrieve data from "
                    "Azure Blob Storage."
                ),
                "details": str(error)
            },
            status_code=502
        )

    except Exception:
        logging.exception(
            "Unexpected nutrition analysis error."
        )

        return json_response(
            {
                "success": False,
                "error": "Internal server error."
            },
            status_code=500
        )