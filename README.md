# set-automatic-function-call-react-component
Ever felt the need to perform a multiple tasks in a interval of your choice with a rapid feedack. Here is the component that will help you achieve in in react


# Features
- Uses Ant Design Library for its UI components
- Dropdown to change the interval of callback function
- Switch to turn the auto callback on or off manually from user end
- Shows the last call time (Last Synced)
- Shows next call time (Next Update)
- Will start and stop the timer to call the callback functions at component mounting and unmounting

# Installation and usage
## Install antd
```  npm i antd ```

## Directly import the index file into your project
``` import AutoCall from 'Your_File-Location'```

## Adding or removing the dropdown options
- Just add or remove the items from the array in options property of state

## Passing the props
###### Property            ###### Type                          ###### Example                              ###### Default
- callbacks       - Array of functions             - ```[callback1, callback2, callback3...]```        - []
- isRefreshing    - Array of type boolean          - ```[loading1, loading2, loading3...]```           - []
- style           - React styke Object             - ```{ backgroundColor : 'white' }```               - { display: 'flex', width: '50%' }
