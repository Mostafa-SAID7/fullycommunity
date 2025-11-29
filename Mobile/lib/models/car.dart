class Car {
  final String id;
  final String make;
  final String model;
  final int year;
  final String licensePlate;
  final String? description;
  final double pricePerDay;
  final String? imageUrl;
  final bool isAvailable;
  final String location;
  final String ownerId;

  Car({
    required this.id,
    required this.make,
    required this.model,
    required this.year,
    required this.licensePlate,
    this.description,
    required this.pricePerDay,
    this.imageUrl,
    required this.isAvailable,
    required this.location,
    required this.ownerId,
  });

  factory Car.fromJson(Map<String, dynamic> json) {
    return Car(
      id: json['id'],
      make: json['make'],
      model: json['model'],
      year: json['year'],
      licensePlate: json['licensePlate'],
      description: json['description'],
      pricePerDay: (json['pricePerDay'] as num).toDouble(),
      imageUrl: json['imageUrl'],
      isAvailable: json['isAvailable'],
      location: json['location'],
      ownerId: json['ownerId'],
    );
  }
}
