import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../providers/auth_provider.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  Future<void> _register() async {
    final success = await context.read<AuthProvider>().register(
      _emailController.text,
      _passwordController.text,
      _firstNameController.text,
      _lastNameController.text,
    );
    if (success && mounted) {
      context.go('/');
    } else if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Registration failed')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Register')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TextField(controller: _firstNameController, decoration: const InputDecoration(labelText: 'First Name')),
            const SizedBox(height: 16),
            TextField(controller: _lastNameController, decoration: const InputDecoration(labelText: 'Last Name')),
            const SizedBox(height: 16),
            TextField(controller: _emailController, decoration: const InputDecoration(labelText: 'Email')),
            const SizedBox(height: 16),
            TextField(controller: _passwordController, decoration: const InputDecoration(labelText: 'Password'), obscureText: true),
            const SizedBox(height: 24),
            Consumer<AuthProvider>(
              builder: (context, auth, _) => ElevatedButton(
                onPressed: auth.isLoading ? null : _register,
                child: auth.isLoading ? const CircularProgressIndicator() : const Text('Register'),
              ),
            ),
            TextButton(onPressed: () => context.go('/login'), child: const Text('Already have an account?')),
          ],
        ),
      ),
    );
  }
}
