/* eslint-disable no-unused-expressions */

import React, { useCallback, useRef } from 'react';
import {
  FiArrowLeft, FiMail, FiUser, FiLock,
} from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import api from '../../services/api';

import { useToast } from '../../hooks/toast';

import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import {
  Container, Background, Content, AnimationContainer,
} from './styles';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  // console.log(formRef);

  const handleSubmit = useCallback(async (data: SignUpFormData) => {
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

      await api.post('/users', data);

      history.push('/');

      addToast({
        type: 'success',
        title: 'Registration was successful.',
        description: 'Please, login to GoBarber!',
      });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);

        return;
      }

      addToast({
        type: 'error',
        title: 'Error on registering',
        description: 'An error happened while registering.',
      });
    }
  }, [addToast, history]);

  return (
    <Container>
      <Background />

      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Register</h1>
            <Input name="name" icon={FiUser} placeholder="name" />
            <Input name="email" icon={FiMail} placeholder="email" />
            <Input name="password" icon={FiLock} type="password" placeholder="password" />
            <Button type="submit">Register</Button>
            <a href="forgot">Forgot my password</a>
          </Form>

          <Link to="/">
            <FiArrowLeft />
            Back to Logon
          </Link>
        </AnimationContainer>
      </Content>

    </Container>
  );
};

export default SignUp;
