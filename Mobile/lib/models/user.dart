class User {
  final String id;
  final String email;
  final String firstName;
  final String lastName;
  final String? phoneNumber;

  User({
    required this.id,
    required this.email,
    required this.firstName,
    required this.lastName,
    this.phoneNumber,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      email: json['email'],
      firstName: json['firstName'],
      lastName: json['lastName'],
      phoneNumber: json['phoneNumber'],
    );
  }

  String get fullName => '$firstName $lastName';
}
