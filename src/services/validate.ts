import { chain, Either, fromPredicate } from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { every, map } from 'fp-ts/Array';
import { Predicate } from 'fp-ts/lib/Predicate';
import { isEmpty } from 'fp-ts/lib/string';

export const validate =
  <T>(validators: Array<Predicate<T>>, errorMessage: string) =>
  (value: T) =>
    pipe(
      value,
      fromPredicate(
        (val) => {
          return pipe(
            validators,
            map((fn) => fn(val)),
            every(Boolean)
          );
        },
        () => errorMessage
      )
    );

const isNotEmpty = (value: string) => !isEmpty(value);

const startsWith =
  (search: string): Predicate<string> =>
  (text: string) =>
    text.startsWith(search);

const lengthRange =
  (min: number, max: number): Predicate<string> =>
  (text: string) =>
    text.length >= min && text.length <= max;

const isInValidPhoneNumber = (text: string) => !/[^0-9\\s\\-]/gi.test(text);

const isInvalidName = (text: string) =>
  !/[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z]/gi.test(text);

export const validatePhoneNumber = (
  phoneNumber: string
): Either<string, string> =>
  pipe(
    phoneNumber,
    validate([isNotEmpty], '필수항목입니다.'),
    chain(
      validate(
        [
          isInValidPhoneNumber, // 숫자 외에 다른 문자가 있는지 확인합니다.
          startsWith('01'), // 휴대폰 번호는 01로 시작
          lengthRange(10, 11), // 휴대폰 번호의 길이는 최소 10자 ~ 11자
        ],
        '올바르지 않은 번호형식입니다.'
      )
    )
  );
export const validateOnChangePhoneNumber = (
  phoneNumber: string
): Either<string, string> =>
  pipe(
    phoneNumber,
    validate(
      [
        isInValidPhoneNumber, // 숫자 외에 다른 문자가 있는지 확인합니다.
        lengthRange(0, 11), // 휴대폰 번호의 길이는 최소 10자 ~ 11자
      ],
      '올바르지 않은 번호형식입니다.'
    )
  );

export const validateName = (name: string): Either<string, string> =>
  pipe(
    name,
    validate([isNotEmpty], '필수항목입니다.'),
    chain(
      validate(
        [
          isInvalidName, // 영문, 한글 외에 다른 문자가 있는지 확인합니다.
          lengthRange(2, 10),
        ],
        '올바르지 않은 이름형식입니다.'
      )
    )
  );
export const validateOnChangeName = (name: string): Either<string, string> =>
  pipe(
    name,
    validate(
      [
        isInvalidName, // 영문, 한글 외에 다른 문자가 있는지 확인합니다.
        lengthRange(0, 10),
      ],
      '올바르지 않은 이름형식입니다.'
    )
  );
