const validatePassword = (pass: any) => {
    if(pass === null || pass === undefined) return false
    // let n = 0;
    // if (/\d/.test(pass)) n++;//包含数字
    // if (/[a-z]/.test(pass)) n++;//包含小写字母
    // if (/[A-Z]/.test(pass)) n++;//包含大写字母
    // if (/[_]/.test(pass)) n++;//包含其他字符
    let abc = /^[A-Za-z0-9_]*$/
    if (abc.test(pass)) {
        return true
    }else {
        return false
    }
}
 // 验证新密码
 const checkPassword = (rule: any, value: any, callback: any) => {
    if (value === '') {
        return callback(new Error('请输入密码'))
    } else if (!validatePassword(value)) {
        return callback(new Error('请输入 6-20 字母/数字/符号组合'))
    } else {
        callback()
    }
}
export {
    checkPassword,
    validatePassword,
}
// // 验证确认密码
// const checkConfirmPassword = (rule: any, value: any, callback: any) => {
//     if (value === '') {
//         return callback(new Error('请再次输入密码'))
//     } else if (!validatePassword(value)) {
//         return callback(new Error('不符合规则'))
//     } else if (value !== this.userPasswordForm.new_password) {
//         return callback(new Error('确认密码与新密码不一致'))
//     } else {
//         callback()
//     }
// }