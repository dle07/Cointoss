import concurrent.futures 
from itertools import repeat
import numbers
import time


myList = []
nums1 = [1,2,3,4]
nums2 = [1,2,3,4]

def sum(one, two, myList ):
    print(one)
    print(two)
    time.sleep(0.5)
    myList.append(one)
    myList.append(two)


with concurrent.futures.ThreadPoolExecutor(10) as executor:
    executor.map(sum, nums1,nums2, repeat(myList) )      # itertools.repeat repeats myList var


print(myList)