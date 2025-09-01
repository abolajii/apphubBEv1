import { User } from "../models/user";
import bcrypt from "bcrypt";
import { Op } from "sequelize";

const UserService = {
  add: async (data: any) => {
    try {
      // Hash password before saving
      const hashedPassword = await bcrypt.hash(data.password, 10);
      
      // Create user with hashed password
      const user = await User.create({
        username: data.username,
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role || 'user',
        isActive: data.isActive !== undefined ? data.isActive : true
      });

      // Return user without password
      const { password, ...userWithoutPassword } = user.toJSON();
      return { 
        success: true, 
        message: "User created successfully",
        data: userWithoutPassword
      };
    } catch (err: any) {
      console.log("[ERROR - UserService.add]", err);
      throw err;
    }
  },

  get: async (id: string) => {
    try {
      return { success: true, message: "User retrieved successfully" };
    } catch (err: any) {
      console.log("[ERROR - UserService.get]", err);
      throw err;
    }
  },

  getAll: async () => {
    try {
      return { success: true, message: "All users retrieved successfully" };
    } catch (err: any) {
      console.log("[ERROR - UserService.getAll]", err);
      throw err;
    }
  },

  update: async (id: string, data: any) => {
    try {
      return { success: true, message: "User updated successfully" };
    } catch (err: any) {
      console.log("[ERROR - UserService.update]", err);
      throw err;
    }
  },

  delete: async (id: string) => {
    try {
      return { success: true, message: "User deleted successfully" };
    } catch (err: any) {
      console.log("[ERROR - UserService.delete]", err);
      throw err;
    }
  },

  entry: async (data: any) => {
    try {
      return { success: true, message: "Welcome to User entry!" };
    } catch (err: any) {
      console.log("[ERROR - UserService.entry]", err);
      throw err;
    }
  },

  checkExisting: async (data: any) => {
    try {
      const { username, email } = data;
      
      // Check for existing username or email
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [
            { username: username },
            { email: email }
          ]
        }
      });

      if (existingUser) {
        const field = existingUser.username === username ? 'username' : 'email';
        return { 
          success: false, 
          message: `User with this ${field} already exists`,
          exists: true,
          field: field
        };
      }

      return { 
        success: true, 
        message: "User does not exist, can proceed with creation",
        exists: false
      };
    } catch (err: any) {
      console.log("[ERROR - UserService.checkExisting]", err);
      throw err;
    }
  }
};

export { UserService };
