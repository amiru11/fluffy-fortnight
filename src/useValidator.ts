import { useCallback, useState } from 'react';
import { match, type Either } from 'fp-ts/Either';
import { identity, pipe } from 'fp-ts/function';
import { isEmpty } from 'fp-ts/string';

type StateValidator = {
  validate: () => boolean;
  error: string;
};

interface useValidatorProps<T> {
  initialState: T;
  validator: (value: T) => Either<string, T>;
  onChangeValidator: (value: T) => Either<string, T>;
}

export const useValidator = <T>({
  initialState,
  validator,
  onChangeValidator,
}: useValidatorProps<T>): [T, (v: T) => void, StateValidator] => {
  const [value, setValue] = useState<T>(initialState);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const changeError = (e: string) => {
    setErrorMessage(e);
    return e;
  };

  const changeValue = (newValue: T) => {
    pipe(
      onChangeValidator(newValue), // 검증시작
      match(
        (error) => error, // match error
        () => pipe(newValue, setValue, () => '') // match success
      ), // 일치여부 확인
      changeError // 모두 불일치 시, error를 받아서 리턴한다.
    );
  };

  const stateValidator: StateValidator = {
    validate(): boolean {
      return pipe(
        validator(value),
        match(identity, () => ''),
        changeError,
        isEmpty
      );
    },

    get error(): string {
      return errorMessage;
    },
  };

  return [value, changeValue, stateValidator];
};
