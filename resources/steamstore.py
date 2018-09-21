"""
Steam Store Scrapper
----
This script updates a JSON with Steam store prices depending on
which games/apps have badges.

Note:
	Steam locks the currency to the PC's location, so a VPN or something
	is necessary to obtain desired currency.
	Since steamcardexchange.net seems to only store USD currency, run this .py
	script with a VPN located in the US.
"""
import urllib.request
from urllib.error import HTTPError
import json
import time

numReq = 0

def getRequest(url):
	"""
	Obtain HTTP GET request given <url>.
	numReq is used for debugging; observe when error 429 occurs.

	@type url: str
	@rtype: file-like object
	"""
	global numReq
	try:
		numReq += 1
		return urllib.request.urlopen(url)
	except HTTPError as e:
		if e.code == 429:
			print("Request #" + str(numReq), end='', flush=True)
			for i in range(5):
				print('.', end='', flush=True)
				time.sleep(1)
			print()
			numReq -= 1
			return getRequest(url)
		raise

def main():
	result = {}

	# Get the games that have badges according to steamcardexchange.net
	url = "https://www.steamcardexchange.net/api/request.php?" \
	"GetBadgePrices_Guest"
	jsonReq = json.load(getRequest(url))
	steamBadgeData = jsonReq['data']
	
	# Iterate through each game, finding the corresponding game in Steam store
	for key in steamBadgeData:
		game = key[0][0]
		url = "https://store.steampowered.com/api/appdetails?appids=" \
		+ game + "&filters=price_overview"
		
		jsonReq = json.load(getRequest(url))
		print(jsonReq) # debugging purposes

		result[game] = {}
		if (jsonReq[game]['success']):
			# Games with 'data' have prices; games without are free-to-play.
			if (jsonReq[game]['data']):
				result[game]['initial'] = jsonReq[game]['data']['price_overview']['initial']
				result[game]['final'] = jsonReq[game]['data']['price_overview']['final']
			else:
				result[game]['initial'] = 0
				result[game]['final'] = 0
		else:
			result[game]['initial'] = -1
			result[game]['final'] = -1

	with open('data.json', 'w') as outfile:
		json.dump(result, outfile)

if __name__ == "__main__":
	main()
