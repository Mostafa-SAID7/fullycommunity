import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../providers/auth_provider.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _phoneController = TextEditingController();

  @override
  void initState() {
    super.initState();
    final user = context.read<AuthProvider>().user;
    if (user != null) {
      _firstNameController.text = user.firstName;
      _lastNameController.text = user.lastName;
      _phoneController.text = user.phoneNumber ?? '';
    }
  }

  Future<void> _save() async {
    final success = await context.read<AuthProvider>().updateProfile(
      firstName: _firstNameController.text,
      lastName: _lastNameController.text,
      phoneNumber: _phoneController.text,
    );
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(success ? 'Profile updated' : 'Update failed')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              context.read<AuthProvider>().logout();
              context.go('/');
            },
          ),
        ],
      ),
      body: Consumer<AuthProvider>(
        builder: (context, auth, _) {
          if (auth.user == null) {
            return const Center(child: Text('Please login'));
          }
          return Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                TextField(controller: _firstNameController, decoration: const InputDecoration(labelText: 'First Name')),
                const SizedBox(height: 16),
                TextField(controller: _lastNameController, decoration: const InputDecoration(labelText: 'Last Name')),
                const SizedBox(height: 16),
                TextField(controller: _phoneController, decoration: const InputDecoration(labelText: 'Phone')),
                const SizedBox(height: 16),
                TextField(decoration: InputDecoration(labelText: 'Email', enabled: false, hintText: auth.user!.email)),
                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: auth.isLoading ? null : _save,
                  child: auth.isLoading ? const CircularProgressIndicator() : const Text('Save'),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
