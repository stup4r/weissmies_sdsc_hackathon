# weissmies_sdsc_hackathon
## SDSC Hackathon Parliament Data

# Project Overview

The weissmies_sdsc_hackathon project was developed as part of the "ORD for the Sciences" Hackathon organized by the Swiss Data Science Center (SDSC). This project leverages data from the Swiss Parliament to analyze the activities of parliament members by region. The goal is to provide insightful visualizations that highlight legislative trends and regional focuses.

# Features
- Number of Bills per Topic per Canton per Year: Visualize how many bills are introduced in various topics across different cantons annually.
- Number of Bills per Deputy per Canton per Year: Track the legislative activity of individual deputies within their respective cantons over time.
- Main Keywords of the Bills per Canton per Year: Identify and display the primary keywords associated with bills in each canton annually, computed using a Large Language Model (LLM).

# Data Sources

Swiss Parliament Data: [Dataset](https://zenodo.org/records/13920293)


# Installation

Follow the steps below to set up the project locally.
### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later) or Yarn
- Python (v3.12 or later)
- Poetry (for Python dependency management)

### Clone the Repository

```bash
git clone https://github.com/stup4r/weissmies_sdsc_hackathon.git
cd weissmies_sdsc_hackathon
```

### Data Analysis Setup

1. Install Python Dependencies:

The project uses both `requirements.txt` and `poetry.lock` for dependency management. You can choose either method.

Using `pip`:

```bash
    pip install -r requirements.txt
````
Using Poetry:

```bash
    poetry install
```

### Configure Environment Variables:

Create a `.env` file in the root directory and add the necessary environment variables:

``` env
DBPASS=<your_db_password>
OPENAI_API_KEY = <your_openai_api_key>
```

### Run Data Generation Notebooks:

Use Jupyter notebooks to query the Neo4j database and generate the required data.

### Frontend Setup

1. Install Frontend Dependencies:

Using npm:

```bash

npm install
```

2. Run the Frontend Application:

Using npm:

``` bash

npm run dev
```


3. Access the Application:

    Open your browser and navigate to `http://localhost:5173/` to view the application.

# License

This project is licensed under the MIT License.

# Authors

- [stup4r](https://github.com/stup4r)
- [FrancescoGarassino](https://github.com/FrancescoGarassino)
- [Clement-Lef](https://github.com/Clement-Lef)