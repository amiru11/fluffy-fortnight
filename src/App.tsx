import * as React from 'react';
import './App.css';

import { useValidator } from './useValidator';
import {
  validatePhoneNumber,
  validateOnChangePhoneNumber,
  validateName,
  validateOnChangeName,
} from './services/validate';

const App = () => {
  const [name, setName, nameValidator] = useValidator<string>({
    initialState: '',
    validator: validateName,
    onChangeValidator: validateOnChangeName,
  });
  const [phoneNumber, setPhoneNumber, phoneNumberValidator] =
    useValidator<string>({
      initialState: '',
      validator: validatePhoneNumber,
      onChangeValidator: validateOnChangePhoneNumber,
    });

  const handleChangePhoneNumber: React.ChangeEventHandler<HTMLInputElement> = ({
    target,
  }) => {
    if (target.value.length > 11) {
      return;
    }
    setPhoneNumber(target.value);
  };

  const handleChangeName: React.ChangeEventHandler<HTMLInputElement> = ({
    target,
  }) => {
    if (target.value.length > 10) {
      return;
    }
    setName(target.value);
  };

  const submitForm: React.FormEventHandler = (event) => {
    event.preventDefault();
    const validators = [phoneNumberValidator, nameValidator];
    const isInvalid = validators
      .map((validator) => validator.validate())
      .some((valid) => !valid);

    console.log({
      isInvalid,
      phoneNumberValidator: phoneNumberValidator.validate(),
      nameValidator: nameValidator.validate(),
    });

    if (isInvalid) {
      return;
    }

    alert('성공');
  };

  return (
    <div className="App">
      <form onSubmit={submitForm}>
        <div>
          <label>Name</label>
          <input type="text" onChange={handleChangeName} value={name} />
          <p>{nameValidator.error}</p>
        </div>
        <div>
          <label>Phone</label>
          <input
            type="text"
            onChange={handleChangePhoneNumber}
            value={phoneNumber}
          />
          <p>{phoneNumberValidator.error}</p>
        </div>
        <button type="submit">submit</button>
      </form>
    </div>
  );
};

export default App;
