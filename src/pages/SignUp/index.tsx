/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/ban-types */
import React, { useCallback, useRef } from 'react';
import {
  FiArrowLeft, FiMail, FiUser, FiLock,
} from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Background, Content } from './styles';

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  // console.log(formRef);

  const handleSubmit = useCallback(async (data: object) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required('Name is obligatory.'),
        email: Yup.string().required('E-mail is obligatory.').email('Email is not valid.'),
        password: Yup.string().min(6, 'Must have at least 6 digits.'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });
    } catch (err) {
      const errors = getValidationErrors(err);

      formRef.current?.setErrors(errors);
    }
  }, []);

  return (
    <Container>
      <Background />

      <Content>
        <img src={logoImg} alt="GoBarber" />
        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Register</h1>
          <Input name="name" icon={FiUser} placeholder="name" />
          <Input name="email" icon={FiMail} placeholder="email" />
          <Input name="password" icon={FiLock} type="password" placeholder="password" />
          <Button type="submit">Register</Button>
          <a href="forgot">Forgot my password</a>
        </Form>

        <a href="login">
          <FiArrowLeft />
          Back to Logon
        </a>
      </Content>

    </Container>
  );
};

export default SignUp;
