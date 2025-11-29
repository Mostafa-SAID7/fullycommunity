import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Fully Community')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.people, size: 100, color: Colors.blue),
            const SizedBox(height: 24),
            const Text(
              'Welcome to\nFully Community',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            const Text(
              'Connect, share, and grow together',
              style: TextStyle(fontSize: 16, color: Colors.grey),
            ),
            const SizedBox(height: 32),
            Consumer<AuthProvider>(
              builder: (context, auth, _) {
                if (auth.isAuthenticated) {
                  return Column(
                    children: [
                      Text('Hello, ${auth.user?.firstName}!', style: const TextStyle(fontSize: 18)),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: () => context.go('/profile'),
                        child: const Text('My Profile'),
                      ),
                    ],
                  );
                }
                return Column(
                  children: [
                    ElevatedButton(
                      onPressed: () => context.go('/login'),
                      child: const Text('Login'),
                    ),
                    const SizedBox(height: 8),
                    TextButton(
                      onPressed: () => context.go('/register'),
                      child: const Text('Create Account'),
                    ),
                  ],
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
