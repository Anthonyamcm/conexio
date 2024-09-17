import {
  Keyboard,
  NativeSyntheticEvent,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  View,
} from 'react-native';
import { Input } from '../atoms';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

interface DateOfBirthInputProps {
  setFieldValue: (field: string, value: Date) => void;
  setFieldTouched: (field: string, isTouched: boolean) => void;
  touched: { dob?: boolean };
  error?: string;
}

export interface DateOfBirthInputHandle {
  reset: () => void;
}

type InputChangeHandler = (
  text: string,
  nextRef: React.RefObject<TextInput> | undefined,
  prevRef: React.RefObject<TextInput> | undefined,
) => void;

const DateOfBirthInput = forwardRef<
  DateOfBirthInputHandle,
  DateOfBirthInputProps
>((props, ref) => {
  const { setFieldValue, setFieldTouched, touched, error } = props;
  const dayInputRef = useRef<TextInput | null>(null);
  const monthInputRef = useRef<TextInput | null>(null);
  const yearInputRef = useRef<TextInput | null>(null);

  const [day, setDay] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>('');

  const isComplete =
    day.length === 2 && month.length === 2 && year.length === 4;

  useEffect(() => {
    if (isComplete) {
      const dateString = `${year}-${month}-${day}`;
      const date = new Date(dateString);
      setFieldValue('dob', date);
      Keyboard.dismiss();
    }
  }, [day, month, year]);

  const InputChangeHandler: InputChangeHandler = (
    text: string,
    nextRef: React.RefObject<TextInput> | undefined,
    prevRef: React.RefObject<TextInput> | undefined,
  ) => {
    if (text.length === 0 && prevRef && prevRef.current) {
      prevRef.current.focus();
    } else if (text.length === 2 && nextRef && nextRef?.current) {
      nextRef.current.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    text: string,
    prevRef?: React.RefObject<TextInput>,
  ) => {
    if (
      e.nativeEvent.key === 'Backspace' &&
      text.length === 0 &&
      prevRef?.current
    ) {
      prevRef.current.focus();
    }
  };

  const handleDayChange = (text: string) => {
    setDay(text);
    InputChangeHandler(text, monthInputRef, undefined);
  };

  const handleMonthChange = (text: string) => {
    setMonth(text);
    InputChangeHandler(text, yearInputRef, dayInputRef);
  };

  const handleYearChange = (text: string) => {
    setYear(text);
    InputChangeHandler(text, undefined, monthInputRef);
    if (text.length === 4) {
      Keyboard.dismiss();
    }
  };

  useImperativeHandle(ref, () => ({
    reset() {
      setDay('');
      setMonth('');
      setYear('');
      setFieldValue('dob', new Date());
      dayInputRef.current?.focus();
    },
  }));

  const handleBlur = (field: 'day' | 'month' | 'year') => {
    setFieldTouched('dob', true);
  };

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          gap: 15,
          alignItems: 'flex-start',
          overflow: 'hidden',
        }}
      >
        <Input
          placeholder="DD"
          containerStyle={{ flex: 1 }}
          style={{ textAlign: 'center' }}
          keyboardType="number-pad"
          maxLength={2}
          ref={dayInputRef}
          onChangeText={(value) => handleDayChange(value)}
          onKeyPress={(e) => handleKeyPress(e, day, undefined)}
          onBlur={() => handleBlur('day')}
          value={day}
        />
        <Input
          placeholder="MM"
          containerStyle={{ flex: 1 }}
          style={{ textAlign: 'center' }}
          keyboardType="number-pad"
          maxLength={2}
          ref={monthInputRef}
          onChangeText={(value) => handleMonthChange(value)}
          onKeyPress={(e) => handleKeyPress(e, month, dayInputRef)}
          onBlur={() => handleBlur('month')}
          value={month}
        />
        <Input
          placeholder="YYYY"
          containerStyle={{ flex: 1 }}
          style={{ textAlign: 'center' }}
          keyboardType="number-pad"
          maxLength={4}
          ref={yearInputRef}
          onChangeText={(value) => handleYearChange(value)}
          onKeyPress={(e) => handleKeyPress(e, year, monthInputRef)}
          onBlur={() => handleBlur('year')}
          value={year}
        />
      </View>
      {touched.dob && error && isComplete ? (
        <Text style={{ color: 'red', marginTop: 5 }}>{error}</Text>
      ) : null}
    </>
  );
});

export default DateOfBirthInput;
