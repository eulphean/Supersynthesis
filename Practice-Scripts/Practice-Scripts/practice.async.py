import asyncio
  
async def function_asyc():
    while True:
        print("Hello")
    return 0
  
async def function_2():
    print("\n HELLO WORLD \n")
    return 0
  
async def main():
    loop = asyncio.get_event_loop()
    f1 = loop.create_task(function_asyc())
    f2 = loop.create_task(function_2())
    await asyncio.wait([f1, f2])
  
asyncio.run(main())