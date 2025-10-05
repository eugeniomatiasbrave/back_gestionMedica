import bcrypt from 'bcrypt';

export default class AuthService {

	async hashPassword(password) {
		const salt = await bcrypt.genSalt(10);
		return bcrypt.hash(password, salt);
	}

	async validatePassword(password, userPassword) {
		return bcrypt.compare(password, userPassword);
	}
}
