import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../providers/car_provider.dart';

class CarListScreen extends StatefulWidget {
  const CarListScreen({super.key});

  @override
  State<CarListScreen> createState() => _CarListScreenState();
}

class _CarListScreenState extends State<CarListScreen> {
  @override
  void initState() {
    super.initState();
    context.read<CarProvider>().fetchCars();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Available Cars')),
      body: Consumer<CarProvider>(
        builder: (context, provider, _) {
          if (provider.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }
          if (provider.cars.isEmpty) {
            return const Center(child: Text('No cars available'));
          }
          return ListView.builder(
            itemCount: provider.cars.length,
            itemBuilder: (context, index) {
              final car = provider.cars[index];
              return ListTile(
                leading: const Icon(Icons.directions_car),
                title: Text('${car.make} ${car.model}'),
                subtitle: Text('${car.year} • ${car.location}'),
                trailing: Text('\$${car.pricePerDay}/day'),
                onTap: () => context.go('/cars/${car.id}'),
              );
            },
          );
        },
      ),
    );
  }
}
