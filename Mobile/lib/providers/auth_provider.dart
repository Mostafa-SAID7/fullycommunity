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

  Future<void> logout() async {
    await _api.clearToken();
    _user = null;
    notifyListeners();
  }
}
