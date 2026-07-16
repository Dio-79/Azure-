import io
import logging
import os

import pandas as pd
from azure.core.exceptions import AzureError, ResourceNotFoundError
from azure.storage.blob import BlobServiceClient


def get_blob_configuration() -> tuple[str, str, str]:
    """
    Read Blob Storage configuration from environment variables.
    """
    connection_string = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
    container_name = os.getenv(
        "BLOB_CONTAINER_NAME",
        "nutrition-data"
    )
    blob_name = os.getenv(
        "BLOB_FILE_NAME",
        "All_Diets.csv"
    )

    if not connection_string:
        raise ValueError(
            "AZURE_STORAGE_CONNECTION_STRING is missing."
        )

    return connection_string, container_name, blob_name


def download_nutrition_csv() -> pd.DataFrame:
    """
    Download the nutrition CSV from Azure Blob Storage.
    """
    connection_string, container_name, blob_name = (
        get_blob_configuration()
    )

    try:
        blob_service_client = (
            BlobServiceClient.from_connection_string(
                connection_string
            )
        )

        blob_client = blob_service_client.get_blob_client(
            container=container_name,
            blob=blob_name
        )

        logging.info(
            "Downloading %s from container %s",
            blob_name,
            container_name
        )

        csv_bytes = blob_client.download_blob().readall()

        if not csv_bytes:
            raise ValueError("The nutrition CSV is empty.")

        dataframe = pd.read_csv(io.BytesIO(csv_bytes))

        logging.info(
            "CSV columns: %s",
            dataframe.columns.tolist()
        )

        logging.info(
            "Dataset downloaded: %s rows and %s columns",
            len(dataframe),
            len(dataframe.columns)
        )

        return dataframe

    except ResourceNotFoundError as error:
        raise FileNotFoundError(
            f"Could not find '{blob_name}' inside "
            f"the '{container_name}' container."
        ) from error

    except pd.errors.EmptyDataError as error:
        raise ValueError(
            "The CSV does not contain readable data."
        ) from error

    except pd.errors.ParserError as error:
        raise ValueError(
            "The blob is not a valid CSV file."
        ) from error

    except AzureError as error:
        logging.exception("Azure Blob Storage request failed.")

        raise RuntimeError(
            "The Function could not access Azure Blob Storage."
        ) from error