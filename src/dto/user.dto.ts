import {UserModel} from "../models/user.model";

export class UserDto {
	id: string;
	email: string;
	isConfirmed: boolean;

	constructor(userModel: InstanceType<typeof UserModel>) {
		this.id = userModel._id.toString();
		this.email = userModel.email;
		this.isConfirmed = userModel.isConfirmed;
	}
}
