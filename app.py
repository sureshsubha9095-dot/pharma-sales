from flask import Flask, jsonify, render_template
import pandas as pd

app = Flask(__name__)

# Load data
df = pd.read_csv("data/pharma_sales.csv")
df['Date'] = pd.to_datetime(df['Date'])

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/reports')
def reports():
    return render_template("reports.html")

@app.route('/settings')
def settings():
    return render_template("settings.html")

@app.route('/sales-by-drug')
def sales_by_drug():
    data = df.groupby('Drug')['Sales'].sum().reset_index()
    return jsonify(data.to_dict(orient='records'))

@app.route('/sales-by-region')
def sales_by_region():
    data = df.groupby('Region')['Sales'].sum().reset_index()
    return jsonify(data.to_dict(orient='records'))

@app.route('/monthly-sales')
def monthly_sales():
    df['Month'] = df['Date'].dt.to_period('M')
    data = df.groupby('Month')['Sales'].sum().reset_index()
    data['Month'] = data['Month'].astype(str)
    return jsonify(data.to_dict(orient='records'))

if __name__ == '__main__':
    app.run(debug=True)