import socket
import requests
import os
import uuid
import boto3
from datetime import datetime
import paho.mqtt.subscribe as subscribe
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv('API_KEY')

status = "false"
topic = "home/penny1/usb/victron/battery-voltage"

def publish_status(hengeData, weather):
	dynamodb = boto3.resource(
		'dynamodb',
		region_name='ap-southeast-2',
		aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
		aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
	)

	for value in hengeData:
		print(f'Publishing status for {hengeData[value]["name"]}')

		table = dynamodb.Table('dev-penny-rebuild-Status')

		newUuid = uuid.uuid4().hex
		currentTime = str(datetime.now())

		item = {
			'id': newUuid,
			'hengeId': hengeData[value]["name"],
			'createdAt': currentTime,
			'updatedAt': currentTime,
			'status': hengeData[value]["status"],
			'voltage': str(hengeData[value]["voltage"]),
			'cloud': str(weather['cloud']),
			'updated': weather['last_updated'],
			'condition': weather['condition'],
			'uv': str(weather['uv']),
			'temperature': str(weather['temp'])
		}

		table.put_item(
			Item=item
		)

def get_status(henge):
	try:
		with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
			s.connect((henge, 22))
		status = "true"
	except OSError as e:
		status = "false"
	
	return status

def get_voltage(henge, name):
  voltage = subscribe.simple(f'home/{name}/usb/victron/battery-voltage', hostname=henge)
	
  return voltage.payload.decode('utf-8')

def get_weather():
	# Make sure all required weather variables are listed here
	# The order of variables in hourly or daily is important to assign them correctly below
	url = "http://api.weatherapi.com/v1/current.json"
	params = {
		"key": API_KEY,
		"q": "Penrith",
		"aqi": "no",
	}
	response = requests.get(url, params=params)

	# Assign weather variables
	weather = {
		"condition": response.json()['current']['condition']['text'],
		"temp": response.json()['current']['temp_c'], 
		"cloud": response.json()['current']['cloud'],
		"last_updated": response.json()['current']['last_updated'],
		"uv": response.json()['current']['uv'],
		"precip": response.json()['current']['precip_mm'],
	}

	return weather
