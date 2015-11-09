import grovepi

grovepi.pinMode(5, "OUTPUT")
print("Grove Pi pin setup successful")
prev = 0
while True:
	try:
		val = grovepi.analogRead(0)
		if prev != val:
			print(val)
			prev = val
	except IOError:
		print(IOError)

