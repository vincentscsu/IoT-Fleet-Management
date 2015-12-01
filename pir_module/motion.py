import RPi.GPIO as io
import socket
import time

io.setmode(io.BCM)
pir_pin = 18
io.setup(pir_pin, io.IN)

while True:
	print(io.input(pir_pin))
	time.sleep(0.5)
