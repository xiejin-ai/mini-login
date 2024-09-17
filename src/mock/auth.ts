import Mock from 'mockjs';

Mock.mock('/api/auth/login', 'post',(data)=>{
  const req = JSON.parse(data.body)
  if(req.username === '328649681@qq.com' && req.password === '123456@qq'){
    return {
      status: 200,
      data: {
        accessToken: '1234567890',
        refreshToken: '0987654321'
      }
    }
  }


  return {
    status: 401,
    data: null,
    message: '用户名或密码错误'
  }
})


Mock.mock('/api/auth/logout', 'post', {
  status: 200,
  data: {
    message: '登出成功'
  }
})

Mock.mock('/api/auth/register', 'post', (data)=>{
  console.log(data)
  return {
    status: 200,
    data: data,
    message: '注册成功',
  }
})