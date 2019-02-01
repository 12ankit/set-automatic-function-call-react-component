import React from 'react';
import { Switch, Select, Spin, Icon } from 'antd'

export class AutoCall extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      options: [30, 60, 180, 300, 420, 600, 900, 1800, 3600, 7200],
      interval: 60,
      timer: 0,
      lastSynced: 0,
      isTimerOn: true,
      switchOn: true,
      keyDown: false
    }
  }
  componentDidMount() {
    this.startTimer()
  }
  componentWillUnmount() {
    this.stopTimer()
  }

  stopTimer = () => {
    clearInterval(this.interval)
  }

  startTimer = () => {
    this.interval = setInterval(() => {
      this.tick()
    }, 1000);
  }

  tick = () => {
    this.hitCallback()
    this.setState(state => ({ timer: state.timer + 1, lastSynced: state.lastSynced + 1 }))
  }

  handleIntervalChange = (value) => {
    this.setState({ interval: Number.parseInt(value), timer: 0 })
  }

  switchTimer = () => {
    if (this.state.switchOn) {
      this.setState({ isTimerOn: false, switchOn: false })
    } else {
      this.setState({ isTimerOn: true, switchOn: true })
    }
  }

  validate = () => {
    const { timer, interval } = this.state
    if (timer == interval) {
      return true
    }
    return false
  }

  hitCallback = () => {
    const { isTimerOn } = this.state
    if (isTimerOn && this.validate()) {
      this.setState({ lastSynced: 0, timer: 0 })
      this.props.callbacks.map((callback) => {
        callback()
      })
    } else if (!isTimerOn) {
      this.setState({ timer: 0 })
    }
  }

  capturedEvent = (e) => {
    if (e.target.className.search('autoRefreshSwitch') != -1) {
      return
    }
    console.log(e.type)
    if (!this.state.keyDown && this.state.switchOn) {
      const that = this
      this.setState({ isTimerOn: false, keyDown: true }, () => {
        setTimeout(() => {
          that.setState({ isTimerOn: true, keyDown: false })
        }, 2000)
      })
    }
  }

  checkRefresh = (isRefreshing) => {
    for (let n in isRefreshing) {
      if (isRefreshing[n] != true) {
        return false
      }
    }
    return true
  }

  getTimeStamp = (seconds) => {
    let convertedTime, timeUnit
    const isPlural = value => value > 1 ? true : false
    if (seconds < 60) {
      convertedTime = seconds
      timeUnit = {
        short: 's',
        long: isPlural(convertedTime) ? 'seconds' : 'second'
      }
    } else if (seconds < 3600) {
      convertedTime = Number.parseInt(seconds / 60)
      timeUnit = {
        short: 'm',
        long: isPlural(convertedTime) ? 'minutes' : 'minute'
      }
    } else {
      convertedTime = Number.parseInt(seconds / 3600)
      timeUnit = {
        short: 'h',
        long: isPlural(convertedTime) ? 'hours' : 'hour'
      }
    }

    return {
      time: convertedTime,
      unit: timeUnit
    }
  }

  render() {
    const { options, lastSynced, timer, interval, isTimerOn, switchOn } = this.state;
    const { isRefreshing, style } = this.props
    const checkRefresh = this.checkRefresh(isRefreshing)
    const nextUpdate = this.getTimeStamp(interval - timer)
    const lastUpdate = this.getTimeStamp(lastSynced)

    onkeydown = this.capturedEvent
    onmousedown = this.capturedEvent

    return (
      <div style={{ ...style, display: 'flex', width: '50%' }}>
        <div style={{ display: 'inline-block', width: '40%' }}>
          {isTimerOn && !checkRefresh ? 'Next update comes in ' + nextUpdate.time + nextUpdate.unit.short : ''}
          {!isTimerOn ? 'Paused' : ''}
        </div>
        <div style={{ display: 'inline-block', width: '30%', textAlign: 'center' }}>
          {checkRefresh ? <Spin indicator={<Icon type='loading' spin />} />
            : 'Last Synced ' + lastUpdate.time + lastUpdate.unit.short + ' ago'}
        </div>
        <div style={{ display: 'inline-block', width: '10%' }}>
          <Switch className='autoRefreshSwitch' checked={switchOn} onChange={this.switchTimer} />
        </div>
        <Select style={{ display: 'inline-block', width: '20%' }} onChange={this.handleIntervalChange} defaultValue={this.state.interval}>
          {options.map((option, index) => {
            const timeStamp = this.getTimeStamp(option)
            return <Select.Option key={index} value={option}>{timeStamp.time + ' ' + timeStamp.unit.long}</Select.Option>
          })}
        </Select>
      </div>
    );
  }
}

export default AutoCall;
