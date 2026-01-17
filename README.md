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
`./jmeter -n -t 'location/of/test/file.jmx' -l 'location/of/result/file .jtl'`

#### Generate HTML Report 
`./jmeter -n -t 'location/of/test/file.jmx' -l 'location/of/result/file .jtl' -e -o 'loc/of/reports/folder'`

Sample
`jmeter -n -t /Users/karlmarxroxas/Documents/jmeter/rps-load-test-scripts.jmx -l /Users/karlmarxroxas/Documents/jmeter/reports/results.jtl -e -o /Users/karlmarxroxas/Documents/jmeter/reports/html`