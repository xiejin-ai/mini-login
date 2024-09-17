import styled from "@emotion/styled";
import { Button, Checkbox, ConfigProvider, Form, Input, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { createStyles } from "antd-style";
import { useState } from "react";
import { $storage, getIsMobile } from "../../../utils";
import { useMount } from "ahooks";
import { IAccount } from "../typings";
import { authApi } from "../service";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const { styles } = useStyle();
  const [form] = useForm<IAccount>();
  const [rememberMe, setRememberMe] = useState(false);
  const isMobile = getIsMobile();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  useMount(() => {
    if ($storage.rememberedUsername) {
      setRememberMe(true);
      form.setFieldsValue({
        username: $storage.rememberedUsername,
      });
    }
  });

  const onLogin = async () => {
    await form.validateFields();
    const data = form.getFieldsValue();
    console.log(data);
    if (rememberMe) {
      $storage.rememberedUsername = data.username;
    }
    await authApi.login(data);
    messageApi.success("登录成功");
  };

  return (
    <StyledContainer>
      {contextHolder}
      {!isMobile && (
        <StyledVideo
          src="https://czt.datagrand.cn/videos/layout/home-bg.mp4"
          preload="auto"
          autoPlay
          loop
          playsInline
          muted
        />
      )}
      <StyledBody>
        <StyledTitle>登录</StyledTitle>
        <Form form={form}>
          <Form.Item
            name="username"
            rules={[
              { required: true, message: "请输入邮箱!" },
              { type: "email", message: "邮箱格式不正确!" },
            ]}
          >
            <Input type="text" size={"large"} placeholder="邮箱" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码!" }]}
          >
            <Input.Password size={"large"} placeholder="密码" />
          </Form.Item>
        </Form>
        <StyledOp>
          <Checkbox
            onChange={() => {
              setRememberMe(!rememberMe);
            }}
            checked={rememberMe}
          >
            记住我
          </Checkbox>
        </StyledOp>
        <ConfigProvider
          button={{
            className: styles.linearGradientButton,
          }}
        >
          <Button type={"primary"} size={"large"} block onClick={onLogin}>
            登录
          </Button>
        </ConfigProvider>
        <StyledRegister>
          还未有账号，去<a onClick={()=>navigate("/auth/register")}>注册 </a>
        </StyledRegister>
      </StyledBody>
    </StyledContainer>
  );
};

const useStyle = createStyles(({ prefixCls, css }) => ({
  linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(
        .${prefixCls}-btn-dangerous
      ) {
      border-width: 0;

      > span {
        position: relative;
      }

      &::before {
        content: "";
        background: linear-gradient(135deg, #6253e1, #04befe);
        position: absolute;
        inset: 0;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `,
}));

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: relative;
`;

const StyledTitle = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
`;

const StyledBody = styled.div`
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding-top: 2rem;
  }

  @media (min-width: 769px) {
    width: 25rem;
  }
`;

const StyledOp = styled.div`
  display: flex;
  justify-content: start;
  margin-bottom: 1rem;
  padding: 0 0.5rem;
`;

const StyledVideo = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
`;

const StyledRegister = styled.div`
  display: flex;
  justify-content: end;
  font-size: 0.8rem;
  margin: 1rem 0;
  padding: 0 0.5rem;
  a {
    color: #1890ff;
    cursor: pointer;
    padding-left: 0.25rem;
  }
`;
