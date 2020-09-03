/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-unused-expressions */
import React, { useRef, useCallback } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Background, Content } from './styles';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { signIn } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = useCallback(async (data: SignInFormData) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        email: Yup.string().required('Must type email.').email('Email is not valid.'),
        password: Yup.string().required('Must type password.'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      await signIn({
        email: data.email,
        password: data.password,
      });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);
      }

      addToast({
        type: 'error',
        title: 'Erro na autenticacao',
        description: 'Ocorreu um erro ao fazer login, cheque as credenciais.',
      });
    }
  }, [addToast, signIn]);

  return (
    <Container>
      <Content>
        <img src={logoImg} alt="GoBarber" />
        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Start to Log on</h1>
          <Input name="email" icon={FiMail} placeholder="email" />
          <Input name="password" icon={FiLock} type="password" placeholder="password" />
          <Button type="submit">Login</Button>
          <a href="forgot">Forgot my password</a>
        </Form>

        <a href="caracas">
          <FiLogIn />
          Register
        </a>
      </Content>

      <Background />
    </Container>
  );
};

export default SignIn;
