# JMeter Script for RPS Load test
###### Used in BRP-35 for Performance Benchmarking

-----
#### How to use
This is used for Mac device only

1. Open Terminal
2. `cd apache-jmeter-5.6.3/bin`
3. `./jmeter`
4. Load `rps-load-test-scripts.jmx`

### CLI
#### Run test in Terminal
```./jmeter -n -t 'location/of/test/file.jmx' -l 'location/of/result/file .jtl'```

#### Generate HTML Report 
```./jmeter -n -t 'location/of/test/file.jmx' -l 'location/of/result/file .jtl' -e -o 'loc/of/reports/folder'```

Sample

```jmeter -n -t /Users/karlmarxroxas/Documents/jmeter/rps-load-test-scripts.jmx -l /Users/karlmarxroxas/Documents/jmeter/reports/results.jtl -e -o /Users/karlmarxroxas/Documents/jmeter/reports/html```

#### Document
RP Checklist Guide: https://docs.google.com/document/d/1Mt9_8WB_gTyzNGJ_Ca0C_X5DYKvrmR8moFX7Ev_x3eg/edit?usp=sharing

#### Issues
If you encounter OOM errors, try increasing JVM Heap memory. Edit jmeter batch file or jmeter itself.
Example: I want to change 4gb to 8gb
`"${HEAP:="-Xms4g -Xmx4g -XX:MaxMetaspaceSize=256m"}"`
to
`"${HEAP:="-Xms8g -Xmx8g -XX:MaxMetaspaceSize=256m"}"`