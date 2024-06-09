import json
from flask import Flask, jsonify, request, render_template, send_from_directory


app = Flask(__name__)


# Load data from the specified JSON file
def load_file(file_name):
    with open(f'data/{file_name}.json', 'r') as file:
        return json.load(file)


def data_handler(file_name):
    final_data = load_file(file_name)
    name = request.args.get('search')
    if name:
        final_data = [data for data in final_data if name.lower() in data['login'].lower()]
    return jsonify(final_data)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/<endpoint>', methods=['GET'])
def get_data(endpoint):
    # Define a mapping of endpoint names to file names
    endpoint_files = {
        'website_1': 'website_1',
        'website_2': 'website_2',
        'website_3': 'website_3',
        # Add more endpoints as needed
    }
    
    # Special case for downloading the CV
    if endpoint == 'download_file':
        return send_from_directory('static', 'important_file.txt', as_attachment=True)

    # Check if the endpoint exists in the mapping
    if endpoint in endpoint_files:
        # Call the data_handler function with the corresponding file name
        return data_handler(endpoint_files[endpoint])
    else:

        # Return a 404 error for invalid endpoints
        return jsonify({'error': 'Endpoint not found'}), 404


if __name__ == '__main__':
    app.run()