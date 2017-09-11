import React, { Component } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View
} from 'react-native';
import { Text, Tile, Title, Heading, Button, Icon, Subtitle, Caption } from '@shoutem/ui';
import Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

type DatesType = {
  range: boolean,
  date: ?moment,
  startDate: ?moment,
  endDate: ?moment,
  focusedInput: 'startDate' | 'endDate',
  onDatesChange: (date: { date?: ?moment, startDate?: ?moment, endDate?: ?moment }) => void,
  isDateBlocked: (date: moment) => boolean,
  onDisableClicked: (date: moment) => void
}

type MonthType = {
  range: boolean,
  date: ?moment,
  startDate: ?moment,
  endDate: ?moment,
  focusedInput: 'startDate' | 'endDate',
  currentDate: moment,
  focusedMonth: moment,
  onDatesChange: (date: { date?: ?moment, startDate?: ?moment, endDate?: ?moment }) => void,
  isDateBlocked: (date: moment) => boolean,
  onDisableClicked: (date: moment) => void
}

type WeekType = {
  range: boolean,
  date: ?moment,
  startDate: ?moment,
  endDate: ?moment,
  focusedInput: 'startDate' | 'endDate',
  startOfWeek: moment,
  onDatesChange: (date: { date?: ?moment, startDate?: ?moment, endDate?: ?moment }) => void,
  isDateBlocked: (date: moment) => boolean,
  onDisableClicked: (date: moment) => void
}

const styles = StyleSheet.create({
  calendar: {
    backgroundColor: 'transparent'
  },
  heading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12
  },
  week: {
    flexDirection: 'row'
  },
  dayName: {
    flexGrow: 1,
    flexBasis: 1,
  },
  day: {
    flexGrow: 1,
    flexBasis: 1,
    alignItems: 'center',
    backgroundColor: 'rgb(245, 245, 245)',
    margin: 1,
    padding: 10,
    borderRadius: 2
  },
  dayBlocked: {
    backgroundColor: 'rgb(255, 255, 255)'
  },
  daySelected: {
    backgroundColor: 'rgb(0,0,0)'
  },
  dayText: {
    color: 'rgb(255, 255, 255)',
    fontWeight: '600'
  },
  dayDisabledText: {
    color: 'gray',
    opacity: 0.5,
    fontWeight: '400'
  },
  daySelectedText: {
    color: 'rgb(252, 252, 252)'
  }
});

const dates = (startDate: ?moment, endDate: ?moment, focusedInput: 'startDate' | 'endDate') => {
  if (focusedInput === 'startDate') {
    if (startDate && endDate) {
      return ({ startDate, endDate: null, focusedInput: 'endDate' });
    }
    return ({ startDate, endDate, focusedInput: 'endDate' });
  }

  if (focusedInput === 'endDate') {
    if (endDate && startDate && endDate.isBefore(startDate)) {
      return ({ startDate: endDate, endDate: null, focusedInput: 'endDate' });
    }
    return ({ startDate, endDate, focusedInput: 'startDate' });
  }

  return ({ startDate, endDate, focusedInput });
};

export const Week = (props: WeekType) => {
  const {
    range,
    date,
    startDate,
    endDate,
    focusedInput,
    startOfWeek,
    onDatesChange,
    isDateBlocked,
    onDisableClicked
  } = props;

  const days = [];
  const endOfWeek = startOfWeek.clone().endOf('isoweek');

  Array.from(moment.range(startOfWeek, endOfWeek).by('day')).forEach((day: moment) => {
    const onPress = () => {
      if (isDateBlocked(day)) {
        onDisableClicked(day);
      } else if (range) {
        let isPeriodBlocked = false;
        const start = focusedInput === 'startDate' ? day : startDate;
        const end = focusedInput === 'endDate' ? day : endDate;
        if (start && end) {
          Array.from(moment.range(start, end).by('day')).forEach((dayPeriod: moment) => {
            if (isDateBlocked(dayPeriod)) isPeriodBlocked = true;
          });
        }
        onDatesChange(isPeriodBlocked ?
          dates(end, null, 'startDate') :
          dates(start, end, focusedInput));
      } else {
        onDatesChange({ date: day });
      }
    };

    const isDateSelected = () => {
      if (range) {
        if (startDate && endDate) {
          return day.isSameOrAfter(startDate) && day.isSameOrBefore(endDate);
        }
        return (startDate && day.isSame(startDate)) || (endDate && day.isSame(endDate));
      }
      return date && day.isSame(date);
    };

    const isBlocked = isDateBlocked(day);
    const isSelected = isDateSelected();

    const style = [
      styles.day,
      isBlocked && styles.dayBlocked,
      isSelected && styles.daySelected
    ];


    days.push(
      <TouchableOpacity
        key={day.date()}
        style={style}
        styleName="rounded-corners"
        onPress={onPress}
        disabled={isBlocked && !onDisableClicked}
      >
        <Text style={{ color: 'rgb(255, 255, 255)', fontWeight: '600', color: (isSelected ? "white" : 'grey') }}>{day.date()}</Text>
      </TouchableOpacity>
    );
  });

  return (
    <View style={styles.week}>{days}</View>
  );
};

export const Month = (props: MonthType) => {
  const {
    range,
    date,
    startDate,
    endDate,
    focusedInput,
    currentDate,
    focusedMonth,
    onDatesChange,
    isDateBlocked,
    onDisableClicked
  } = props;

  const dayNames = [];
  const weeks = [];
  const startOfMonth = focusedMonth.clone().startOf('month').startOf('isoweek');
  const endOfMonth = focusedMonth.clone().endOf('month');
  const monthArray = Array.from(moment.range(startOfMonth, endOfMonth).by('week'));
  const weekRange = moment.range(currentDate.clone().startOf('isoweek'), currentDate.clone().endOf('isoweek'));
  const weekArray = Array.from(weekRange.by('day'));
  
  weekArray.forEach( (day: moment) => {
    dayNames.push(
      <View key={day.date()} style={styles.dayName}>
        <Text styleName="h-center">
          {day.format('ddd')}
        </Text>
      </View>
    );
  });

  
  monthArray.forEach((week: moment) => {
    weeks.push(
      <Week
        key={week}
        range={range}
        date={date}
        startDate={startDate}
        endDate={endDate}
        focusedInput={focusedInput}
        currentDate={currentDate}
        focusedMonth={focusedMonth}
        startOfWeek={week}
        onDatesChange={onDatesChange}
        isDateBlocked={isDateBlocked}
        onDisableClicked={onDisableClicked}
      />
    );
  });

  return (
    <View style={styles.month}>
      <View style={styles.week}>
        {dayNames}
      </View>
      {weeks}
    </View>
  );
};

export default class Dates extends Component {
  state = {
    currentDate: moment(),
    focusedMonth: moment().startOf('month')
  }
  props: DatesType;

  render() {
    const previousMonth = () => {
      this.setState({ focusedMonth: this.state.focusedMonth.add(-1, 'M') });
    };

    const nextMonth = () => {
      this.setState({ focusedMonth: this.state.focusedMonth.add(1, 'M') });
    };

    return (
      <View style={styles.calendar}>
        <View style={styles.heading}>
          <TouchableOpacity onPress={previousMonth}>
            <Icon name="left-arrow"/>
          </TouchableOpacity>
          <Text>{this.state.focusedMonth.format('MMM YYYY')}</Text>
          <TouchableOpacity onPress={nextMonth}>
            <Icon name="right-arrow"/>
          </TouchableOpacity>
        </View>
        <Month
          range={this.props.range}
          date={this.props.date}
          startDate={this.props.startDate}
          endDate={this.props.endDate}
          focusedInput={this.props.focusedInput}
          currentDate={this.state.currentDate}
          focusedMonth={this.state.focusedMonth}
          onDatesChange={this.props.onDatesChange}
          isDateBlocked={this.props.isDateBlocked}
          onDisableClicked={this.props.onDisableClicked}
        />
      </View>
    );
  }
}