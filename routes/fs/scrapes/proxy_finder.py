#Created by Jeremy Jung (Thursday, June 7, 2018)
#Takes scripts from the command line and returns addresses of proxies by type
#from urllib import FancyURLopener
from random import choice
#from urllib2 import urlopen
import urllib3
from bs4 import BeautifulSoup
import time
import requests

user_agents = [
               'Mozilla/5.0 (Windows; U; Windows NT 5.1; it; rv:1.8.1.11) Gecko/20071127 Firefox/2.0.0.11',
               'Opera/9.25 (Windows NT 5.1; U; en)',
               'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322; .NET CLR 2.0.50727)',
               'Mozilla/5.0 (compatible; Konqueror/3.5; Linux) KHTML/3.5.5 (like Gecko) (Kubuntu)',
               'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.8.0.12) Gecko/20070731 Ubuntu/dapper-security Firefox/1.5.0.12',
               'Lynx/2.8.5rel.1 libwww-FM/2.14 SSL-MM/1.4.1 GNUTLS/1.2.9',
               'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.89 Safari/537.36',
               'Mozilla/5.0 (Unknown; Linux) AppleWebKit/538.1 (KHTML, like Gecko) Chrome/v1.0.0 Safari/538.1',
               'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2483.0 Safari/537.36',
               'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
               'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36']

## This returns A LIST OF ALL HTTPS PROXIES in the order they appear on the provider website. The list contains four list items in the following increasing-indicies order (IP, Port number, Country, Anonymity).  Proxy anonymity can either be elite proxy, anonymous, or transparent.
# There are 3 levels of proxies according to their anonymity.
# Level 1 - Elite Proxy / Highly Anonymous Proxy: The web server can't detect whether you are using a proxy.
# Level 2 - Anonymous Proxy: The web server can know you are using a proxy, but it can't know your real IP.
# Level 3 - Transparent Proxy: The web server can know you are using a proxy and it can also know your real IP.
def HTTPS_proxy_list_generator():
    url = 'https://free-proxy-list.net'
    session = requests.Session()
    headers = {
        "User-Agent": 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
    }
    r = session.get(url, headers = headers, verify = False)
    # reads the html of the page
    text = r.data
    # parses the page content
    soup = BeautifulSoup(text,'html.parser')
    # finds all attribute class of td (<td>...</td>) and puts them into tdlist
    tdlist = soup.find_all('td')
    list = []
    # first indicies of different pieces of information as they appear in tdlist.  Later we increment these by 8 to get the next item of the same information (e.g. at tdlist[0] it is 181.47.19.62, and at tdlist[8] it is 42.104.84.106)
    ipindex = 0
    portindex = 1
    countryindex = 3
    anonindex = 4
    httpindex = 6
    # finds the total number of proxy servers in the list (total number of info pieces / total number of info pieces PER proxy server)
    size = len(soup.find_all('td'))/9
    # makes a list contain 4 different list items to put (IP, Port #, Country, and anonymity)
    for p in range(0,4):
        list.append([])
    #for each list item, its index is incremented by 8 so the next info piece is appended.
    for x in range(0,size):
        if str(tdlist[6+x*8])[15:-5] == 'yes':
            list[0].append(str(tdlist[ipindex])[4:-5])
            list[1].append(str(tdlist[portindex])[4:-5])
            list[2].append(str(tdlist[countryindex])[15:-5])
            list[3].append(str(tdlist[anonindex])[4:-5])
        ipindex = ipindex + 8
        portindex = portindex + 8
        countryindex = countryindex + 8
        anonindex = anonindex + 8
    return list

## This returns A LIST OF ALL HTTP PROXIES in the order they appear on the provider website. The list contains four list items in the following increasing-indicies order (IP, Port number, Country, Anonymity).  Proxy anonymity can either be elite proxy, anonymous, or transparent.
# There are 3 levels of proxies according to their anonymity.
# Level 1 - Elite Proxy / Highly Anonymous Proxy: The web server can't detect whether you are using a proxy.
# Level 2 - Anonymous Proxy: The web server can know you are using a proxy, but it can't know your real IP.
# Level 3 - Transparent Proxy: The web server can know you are using a proxy and it can also know your real IP.
def HTTP_proxy_list_generator():
    myopener = MyOpener()
    # creates a URL opening object
    page = myopener.open('https://free-proxy-list.net')
    # reads the html of the page
    text = page.read()
    # parses the page content
    soup = BeautifulSoup(text,'html.parser')
    # finds all attribute class of td (<td>...</td>) and puts them into tdlist
    tdlist = soup.find_all('td')
    list = []
    # first indicies of different pieces of information as they appear in tdlist.  Later we increment these by 8 to get the next item of the same information (e.g. at tdlist[0] it is 181.47.19.62, and at tdlist[8] it is 42.104.84.106)
    ipindex = 0
    portindex = 1
    countryindex = 3
    anonindex = 4
    httpindex = 6
    # finds the total number of proxy servers in the list (total number of info pieces / total number of info pieces PER proxy server)
    size = len(soup.find_all('td'))/9
    # makes a list contain 4 different list items to put (IP, Port #, Country, and anonymity)
    for p in range(0,4):
        list.append([])
    #for each list item, its index is incremented by 8 so the next info piece is appended.
    for x in range(0,size):
        if str(tdlist[6+x*8])[15:-5] == 'no':
            list[0].append(str(tdlist[ipindex])[4:-5])
            list[1].append(str(tdlist[portindex])[4:-5])
            list[2].append(str(tdlist[countryindex])[15:-5])
            list[3].append(str(tdlist[anonindex])[4:-5])
        ipindex = ipindex + 8
        portindex = portindex + 8
        countryindex = countryindex + 8
        anonindex = anonindex + 8
    return list

## This returns a list of unfiltered proxies in the order they appear on the provider website. The list contains four list items in the following increasing-indicies order (IP, Port number, Country, Anonymity). The Socks proxy can either be Socks4 or Socks5.
# All the socks proxies are highly anonymous. The server does not know you are using a proxy.
def SOCKS_proxy_list_generator():
    myopener = MyOpener()
    # creates a URL opening object
    page = myopener.open('https://www.socks-proxy.net')
    # reads the html of the page
    text = page.read()
    # parses the page content
    soup = BeautifulSoup(text,'html.parser')
    # finds all attribute class of td (<td>...</td>) and puts them into tdlist
    tdlist = soup.find_all('td')
    list = []
    # first indicies of different pieces of information as they appear in tdlist.  Later we increment these by 8 to get the next item of the same information (e.g. at tdlist[0] it is 181.47.19.62, and at tdlist[8] it is 42.104.84.106)
    ipindex = 0
    portindex = 1
    countryindex = 3
    anonindex = 4
    # finds the total number of proxy servers in the list (total number of info pieces / total number of info pieces PER proxy server)
    size = len(soup.find_all('td'))/9
    # makes a list contain 4 different list items to put (IP, Port #, Country, and Socks connection type)
    for p in range(0,4):
        list.append([])
    #for each list item, its index is incremented by 8 so the next info piece is appended.
    for x in range(0,size):
        list[0].append(str(tdlist[ipindex])[4:-5])
        list[1].append(str(tdlist[portindex])[4:-5])
        list[2].append(str(tdlist[countryindex])[15:-5])
        list[3].append(str(tdlist[anonindex])[4:-5])
        ipindex = ipindex + 8
        portindex = portindex + 8
        countryindex = countryindex + 8
        anonindex = anonindex + 8
    return list


## This function filters the proxy list according to its basic type, and anonymity for HTTPS or Socks type of connection
#AVAILABLE INPUTS FOR SOCKS                     AVAILABLE INPUTS FOR HTTP                       AVAILABLE INPUTS FOR HTTPS
#proxy_filter('SOCKS','Socks4')                 proxy_filter('HTTP', 'elite proxy')             proxy_filter('HTTPS', 'elite proxy')
#proxy_filter('SOCKS','Socks5')                 proxy_filter('HTTP','anonymous')                proxy_filter('HTTPS','anonymous')
#                                               proxy_filter('HTTP','transparent')              proxy_filter('HTTPS','transparent')
def proxy_filter(proxy_type,anon):
    list= []
    if str(proxy_type) == 'HTTPS':
        list = HTTPS_proxy_list_generator()
    if str(proxy_type) == 'SOCKS':
        list = SOCKS_proxy_list_generator()
    if str(proxy_type) == 'HTTP':
        list = HTTP_proxy_list_generator()
    size = len(list[0])
    proxies = []
    for o in range(0,4):
        proxies.append([])
    for a in range(0,len(list[3])):
        if str(anon) == list[3][a]:
            proxies[0].append(list[0][a])
            proxies[1].append(list[1][a])
            proxies[2].append(list[2][a])
            proxies[3].append(list[3][a])
    size = len(proxies[0])
# if loops were used for the sake of aesthetics in the list
    print("IP\t\t\t" + "Port Number\t" + "Country\t\t\t" + "Proxy Type")
    for x in range(0,size):
        if len(proxies[2][x]) <= 7:
            print(str(proxies[0][x]) + "\t\t" + str(proxies[1][x]) + "\t\t" + str(proxies[2][x]) + "\t\t\t" + str(proxies[3][x]))
        if 7 < len(proxies[2][x]) < 15:
            print(str(proxies[0][x]) + "\t\t" + str(proxies[1][x]) + "\t\t" + str(proxies[2][x]) + "\t\t" + str(proxies[3][x]))
        if len(proxies[2][x]) >= 15:
            print(str(proxies[0][x]) + "\t\t" + str(proxies[1][x]) + "\t\t" + str(proxies[2][x]) + "\t" + str(proxies[3][x]))
    return proxies

if __name__ == '__main__':
    print("Please choose a proxy type among:\nHTTP\nHTTPS\nSOCKS")
    thetype = str(input())
    print("\nYou have chosen: " + thetype + " proxy")
    what = ''
    if thetype == 'HTTP' or 'HTTPS':
        print("If you have chosen HTTP or HTTPS, Please choose an anonymity level among:\nelite proxy\nanonymous\ntransparent if it's HTTP,HTTPS")
        print("If you have chosen HTTP or HTTPS, Please choose a SOCKS protocol between:\nSocks4\nSocks5")
        what = str(input())
    elif thetype == 'SOCKS':
        print("Please choose a SOCKS protocol between:\nSocks4\nSocks5")
        what = str(input())
    print("You have chosen " + what + " " + thetype + " proxies")
    oya = proxy_filter(thetype,what)
    
