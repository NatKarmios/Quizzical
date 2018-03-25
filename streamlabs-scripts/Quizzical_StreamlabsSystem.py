# ---------------------------------------
#  Import Libraries
# ---------------------------------------
import sys
import clr
clr.AddReference("IronPython.SQLite.dll")
clr.AddReference("IronPython.Modules.dll")
import os
from threading import Thread, Event
from json import loads
from Queue import Queue
import traceback


sys.path.append(os.path.join(os.path.dirname(__file__), 'lib'))
# noinspection PyUnresolvedReferences
from quizzical_server import start_http_server


# ---------------------------------------
#  [Required] Script Information
# ---------------------------------------
ScriptName = 'Quizzical'
Website = 'github.com/NatKarmios/Quizzical'
Description = 'A companion script to help Quizzical integrate with the StreamLabs Bot currency system.'
Creator = 'Nat Karmios'
Version = '1.0.0'

# ---------------------------------------
#  Set Variables
# ---------------------------------------
HOST = '127.0.0.1'
PORT = 23120

enabled = True
logQueue = Queue()

add_points_event = Event()
add_points_event.set()

add_points_data = {}
add_points_reply = []


# ---------------------------------------
#  [Required] Initialize Data (Only called on Load)
# ---------------------------------------
def Init():
    Thread(target=start_server).start()
    log('Quizzical companion script, locked and loaded!')


# ---------------------------------------
#  [Required] Execute Data / Process Messages
# ---------------------------------------
def Execute(_):
    # This plugin has no need for Execute() to be called.
    pass


# ---------------------------------------
#  [Required] Tick Function
# ---------------------------------------
def Tick():
    global add_points_event
    global add_points_data
    global add_points_reply

    if not add_points_event.is_set():
        add_points_reply = list(Parent.AddPointsAll(add_points_data))
        log('%s users credited by Quizzical' % (len(add_points_data) - len(add_points_reply)))
        add_points_event.set()

    while not logQueue.empty():
        Parent.Log('Quizzical', logQueue.get())


def Unload():
    pass


def ScriptToggled(state):
    global enabled
    enabled = state


def log(msg):
    logQueue.put(msg)


def handle_add_points_request(raw_data, request_handler):
    global add_points_data
    global add_points_event
    global add_points_reply

    if not enabled:
        request_handler.reply({
            'success': False,
            'message': 'The Quizzical companion script is disabled!'
        })
        return

    try:
        # Throws if the post data fails to parse from JSON
        try:
            data = loads(raw_data)
        except:
            raise ValueError

        # This checks that:
        # 1. the data is a dictionary
        # 2. the data contains the 'amount' attribute
        # 3. the 'amount' attribute is an integer
        # 4. the data contains the 'users' attribute
        # 5. the 'users' attribute is a list
        # 6. each value of the 'users' list attribute is a string
        if not isinstance(data, dict) \
                or 'amount' not in data \
                or not isinstance(data['amount'], int) \
                or 'users' not in data \
                or not isinstance(data['users'], list) \
                or any(map(lambda user: not isinstance(user, (str, unicode)), data['users'])):
            raise ValueError

        amount = data['amount']
        users = data['users']

        add_points_data = dict(map(lambda user: (user.lower(), amount), users))
        add_points_event.clear()
        add_points_event.wait()

        try:
            reply_data = {
                'success': True,
                'message': '%s/%s users credited.' % (len(users) - len(add_points_reply), len(users)),
                'failedToAdd': add_points_reply
            }
            request_handler.reply(reply_data)
        except:
            log(traceback.format_exc())
    except ValueError:
        request_handler.reply({'success': False, 'msg': 'Malformed request'}, response_code=400)


def handle_ping():
    log('Pinged by (probably) Quizzical!')


def start_server():
    start_http_server(handle_add_points_request, handle_ping)


Init()
