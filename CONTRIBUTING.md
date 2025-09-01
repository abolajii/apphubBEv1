# Contributing to AppHub API

Thank you for your interest in contributing to AppHub API! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js (>=18.0.0)
- npm (>=8.0.0)
- MySQL database
- Git

### Development Setup

1. **Fork and Clone**

   ```bash
   git clone https://github.com/yourusername/apphub-api.git
   cd apphub-api
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env
   # Edit .env with your local configuration
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🛠️ Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow existing naming conventions
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### Project Structure

```
src/
├── config/           # Configuration files
├── controllers/      # Request handlers
├── middleware/       # Express middleware
├── models/          # Database models
├── routes/          # API routes
├── services/        # Business logic
├── types/           # TypeScript types
├── utils/           # Utility functions
├── validations/     # Input validation
└── index.ts         # Application entry point
```

### Naming Conventions

- **Files**: Use camelCase (e.g., `userController.ts`)
- **Classes**: Use PascalCase (e.g., `UserService`)
- **Functions/Variables**: Use camelCase (e.g., `getUserById`)
- **Constants**: Use UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`)
- **Database Tables**: Use snake_case (e.g., `user_profiles`)

## 📝 Making Changes

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test additions/updates

### Commit Messages

Use conventional commit format:

```
type(scope): description

Examples:
feat(auth): add JWT token validation
fix(database): resolve connection timeout issue
docs(readme): update API documentation
```

### Pull Request Process

1. **Create Feature Branch**

   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make Changes**

   - Write clean, documented code
   - Follow existing patterns
   - Add appropriate error handling

3. **Test Your Changes**

   ```bash
   npm run dev
   # Test your changes manually
   ```

4. **Commit Changes**

   ```bash
   git add .
   git commit -m "feat(feature): add amazing feature"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/amazing-feature
   ```

## 🧪 Testing

### Manual Testing

- Start the development server: `npm run dev`
- Use Postman collection for API testing
- Test all affected endpoints
- Verify database changes

### Adding New Endpoints

When adding new endpoints, ensure:

- Proper validation using express-validator
- Error handling with appropriate HTTP status codes
- Consistent response format using utility functions
- Database transactions where appropriate

## 📚 Adding Features

### New Model

1. Create model in `src/models/`
2. Add associations in `src/models/index.ts`
3. Create service in `src/services/`
4. Create controller in `src/controllers/`
5. Add routes in `src/routes/`
6. Add validation in `src/validations/`

### New Endpoint

1. Add validation schema
2. Implement service method
3. Create controller method
4. Add route definition
5. Test thoroughly

## 🐛 Bug Reports

When reporting bugs, include:

- **Environment**: OS, Node.js version, npm version
- **Steps to Reproduce**: Clear, numbered steps
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Error Messages**: Full error logs
- **Additional Context**: Screenshots, logs, etc.

### Bug Report Template

```markdown
**Environment:**

- OS: [e.g., macOS 12.0]
- Node.js: [e.g., 18.0.0]
- npm: [e.g., 8.1.0]

**Steps to Reproduce:**

1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior:**
A clear description of what you expected to happen.

**Actual Behavior:**
A clear description of what actually happened.

**Error Messages:**
```

Paste any error messages here

```

**Additional Context:**
Add any other context about the problem here.
```

## 💡 Feature Requests

For feature requests, provide:

- **Problem Statement**: What problem does this solve?
- **Proposed Solution**: How should it work?
- **Alternatives Considered**: Other solutions you've considered
- **Additional Context**: Use cases, examples, etc.

## 🔍 Code Review

### Review Checklist

- [ ] Code follows project conventions
- [ ] Proper error handling
- [ ] Input validation
- [ ] Database operations are safe
- [ ] No sensitive data exposed
- [ ] Performance considerations
- [ ] Documentation updated if needed

## 🚫 What NOT to Include

- Credentials or sensitive information
- Large binary files
- Generated files (dist/, node_modules/)
- IDE-specific files (.vscode/, .idea/)
- OS-specific files (.DS_Store, Thumbs.db)

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🤝 Community

- Be respectful and inclusive
- Help others learn and grow
- Provide constructive feedback
- Follow the code of conduct

## 📧 Questions?

If you have questions about contributing:

- Open an issue for discussion
- Check existing issues and documentation
- Contact maintainers: your.email@example.com

Thank you for contributing to AppHub API! 🙌
