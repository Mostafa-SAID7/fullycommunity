import 'package:go_router/go_router.dart';
import '../screens/home_screen.dart';
import '../screens/car_list_screen.dart';
import '../screens/car_detail_screen.dart';
import '../screens/login_screen.dart';
import '../screens/register_screen.dart';
import '../screens/bookings_screen.dart';

final router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(path: '/', builder: (_, __) => const HomeScreen()),
    GoRoute(path: '/cars', builder: (_, __) => const CarListScreen()),
    GoRoute(path: '/cars/:id', builder: (_, state) => CarDetailScreen(id: state.pathParameters['id']!)),
    GoRoute(path: '/login', builder: (_, __) => const LoginScreen()),
    GoRoute(path: '/register', builder: (_, __) => const RegisterScreen()),
    GoRoute(path: '/bookings', builder: (_, __) => const BookingsScreen()),
  ],
);
