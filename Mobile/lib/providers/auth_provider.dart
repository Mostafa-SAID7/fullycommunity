import 'package:flutter/foundation.dart';
import '../models/user.dart';
import '../services/api_service.dart';

class AuthProvider extends ChangeNotifier {
  final _api = ApiService();
  User? _user;
  bool _isLoading = false;

  User? get user => _user;
  bool get isAuthenticated => _user != null;
  bool get isLoading => _isLoading;

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _api.post('/auth/login', {
        'email': email,
        'password': password,
      });
      await _api.setToken(response['token']);
      _user = User.fromJson(response['user']);
      notifyListeners();
      return true;
    } catch (e) {
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> register(String email, String password, String firstName, String lastName) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _api.post('/auth/register', {
        'email': email,
        'password': password,
        'firstName': firstName,
        'lastName': lastName,
      });
      await _api.setToken(response['token']);
      _user = User.fromJson(response['user']);
      notifyListeners();
      return true;
    } catch (e) {
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> updateProfile({String? firstName, String? lastName, String? phoneNumber}) async {
    _isLoading = true;
    notifyListeners();

    try {
      await _api.put('/auth/me', {
        if (firstName != null) 'firstName': firstName,
        if (lastName != null) 'lastName': lastName,
        if (phoneNumber != null) 'phoneNumber': phoneNumber,
      });
      if (_user != null) {
        _user = User(
          id: _user!.id,
          email: _user!.email,
          firstName: firstName ?? _user!.firstName,
          lastName: lastName ?? _user!.lastName,
          phoneNumber: phoneNumber ?? _user!.phoneNumber,
        );
      }
      notifyListeners();
      return true;
    } catch (e) {
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> logout() async {
    await _api.clearToken();
    _user = null;
    notifyListeners();
  }
}
