import 'package:flutter/foundation.dart';
import '../models/car.dart';
import '../services/api_service.dart';

class CarProvider extends ChangeNotifier {
  final _api = ApiService();
  List<Car> _cars = [];
  bool _isLoading = false;

  List<Car> get cars => _cars;
  bool get isLoading => _isLoading;

  Future<void> fetchCars() async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _api.get('/cars');
      _cars = (response as List).map((json) => Car.fromJson(json)).toList();
    } catch (e) {
      _cars = [];
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<Car?> getCarById(String id) async {
    try {
      final response = await _api.get('/cars/$id');
      return Car.fromJson(response);
    } catch (e) {
      return null;
    }
  }
}
