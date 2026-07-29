FROM node:22-slim

# The revenue prediction feature spawns a Python subprocess (scikit-learn/pandas),
# so this image needs both Node and Python runtimes.
RUN apt-get update && apt-get install -y --no-install-recommends \
      python3 \
      python3-venv \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

# Python deps go in a venv to avoid Debian's PEP 668 "externally managed environment" error.
COPY src/python/ml/requirements.txt ./src/python/ml/requirements.txt
RUN python3 -m venv /opt/venv \
    && /opt/venv/bin/pip install --no-cache-dir -r src/python/ml/requirements.txt

COPY . .

RUN mkdir -p src/python/models \
    && useradd --create-home --shell /bin/bash appuser \
    && chown -R appuser:appuser /app /opt/venv

USER appuser

ENV PATH="/opt/venv/bin:$PATH" \
    PYTHON_PATH="/opt/venv/bin/python3" \
    NODE_ENV=production

EXPOSE 5000

CMD ["node", "src/server.js"]
