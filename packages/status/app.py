import os
import time
from dotenv import load_dotenv
from henge import get_status, get_voltage, get_weather, publish_status

load_dotenv()

API_URL = os.getenv('API_URL')

def run(hengeData, weather):
	for value in hengeData:
		print(f'Starting Status Check on {hengeData[value]["name"]}')
		hengeStatus = get_status(hengeData[value]['ip'])
		hengeData[value]['status'] = hengeStatus
		print('Henge is live:', hengeStatus)

		if (hengeStatus == 'true'):
			print(f'Starting Voltage Check on {hengeData[value]["name"]}')
			hangeVoltage = get_voltage(hengeData[value]['ip'], hengeData[value]['name'])
			hengeData[value]['voltage'] = hangeVoltage
			print('battery voltage:', hangeVoltage)

			if (float(hengeData[value]['voltage']) > 12):
				print('Voltage is good')
			if (float(hengeData[value]['voltage']) < 12):
				print('Voltage is low')

	print("Starting Weather Check")
	weatherData = get_weather()
	for value in weatherData:
		weather[value] = weatherData[value]
		print(f'{value}: {weatherData[value]}')
	
	print("Status Check Complete")

def main():
	startTime = time.monotonic()

	hengeData = {
		'henge1': {
			'ip': '192.168.1.201',
			'name': 'penny1',
			'status': 'false',
			'voltage': '0',
		},
		'henge2': {
			'ip': '192.168.1.202',
			'name': 'penny2',
			'status': 'false',
			'voltage': '0',
		},
		'henge3': {
			'ip': '192.168.1.203',
			'name': 'penny3',
			'status': 'false',
			'voltage': '0',
		},
		'henge4': {
			'ip': '192.168.1.204',
			'name': 'penny4',
			'status': 'false',
			'voltage': '0',
		},
	}

	weather = {
		'condition': '',
		'temp': '0',
		'cloud': '0',
		'last_updated': '0',
		'uv': '0',
		'precip': '0',
	}

	while True:
		run(hengeData, weather)
		publish_status(hengeData, weather)
		time.sleep(60.0 - ((time.monotonic() - startTime) % 60.0))

if __name__ == '__main__':
	main()
