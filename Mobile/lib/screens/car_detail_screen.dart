import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/car.dart';
import '../providers/car_provider.dart';

class CarDetailScreen extends StatefulWidget {
  final String id;
  const CarDetailScreen({super.key, required this.id});

  @override
  State<CarDetailScreen> createState() => _CarDetailScreenState();
}

class _CarDetailScreenState extends State<CarDetailScreen> {
  Car? _car;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadCar();
  }

  Future<void> _loadCar() async {
    final car = await context.read<CarProvider>().getCarById(widget.id);
    setState(() {
      _car = car;
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(_car != null ? '${_car!.make} ${_car!.model}' : 'Car Details')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _car == null
              ? const Center(child: Text('Car not found'))
              : Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('${_car!.make} ${_car!.model}', style: Theme.of(context).textTheme.headlineMedium),
                      const SizedBox(height: 8),
                      Text('Year: ${_car!.year}'),
                      Text('Location: ${_car!.location}'),
                      if (_car!.description != null) Text(_car!.description!),
                      const SizedBox(height: 16),
                      Text('\$${_car!.pricePerDay}/day', style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.blue)),
                      const Spacer(),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(onPressed: () {}, child: const Text('Book Now')),
                      ),
                    ],
                  ),
                ),
    );
  }
}
