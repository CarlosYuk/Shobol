import React, { useState } from "react";
import {
  Mountain,
  Truck,
  Shield,
  Clock,
  Users,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  Star,
  CheckCircle,
} from "lucide-react";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

const LandingPage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const services = [
    {
      icon: Mountain,
      title: "Transporte de Piedra Caliza",
      description:
        "Especialistas en el transporte seguro y eficiente de piedra caliza desde canteras hasta destinos industriales.",
    },
    {
      icon: Truck,
      title: "Flota Especializada",
      description:
        "Vehículos de carga pesada especialmente diseñados para el transporte de materiales minerales.",
    },
    {
      icon: Shield,
      title: "Seguridad Garantizada",
      description:
        "Protocolos de seguridad certificados y seguros completos para cada envío.",
    },
    {
      icon: Clock,
      title: "Entregas Puntuales",
      description: "Cumplimiento del 98.5% en tiempos de entrega programados.",
    },
  ];

  const stats = [
    { number: "15+", label: "Años de Experiencia" },
    { number: "500+", label: "Clientes Satisfechos" },
    { number: "50+", label: "Vehículos en Flota" },
    { number: "98.5%", label: "Entregas a Tiempo" },
  ];

  const testimonials = [
    {
      name: "María González",
      company: "Cementos del Norte S.A.",
      text: "SHOBOL ha sido nuestro socio logístico por más de 5 años. Su confiabilidad y profesionalismo son excepcionales.",
      rating: 5,
    },
    {
      name: "Carlos Mendoza",
      company: "Constructora Andina",
      text: "La calidad del servicio y la puntualidad en las entregas han superado nuestras expectativas.",
      rating: 5,
    },
    {
      name: "Ana Rodríguez",
      company: "Minera del Sur",
      text: "Excelente servicio de transporte. Siempre cumplen con los tiempos acordados y mantienen la calidad.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-stone-50 to-lime-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-emerald-600 to-lime-600 p-2 rounded-xl">
                <Mountain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-lime-700 bg-clip-text text-transparent">
                  SHOBOL S.A.
                </h1>
                <p className="text-sm text-stone-600">
                  Transporte de Piedra Caliza
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowLogin(true)}
                className="px-6 py-2 text-emerald-700 hover:text-emerald-800 font-medium transition-colors"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => setShowRegister(true)}
                className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-lime-600 hover:from-emerald-700 hover:to-lime-700 text-white font-medium rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-lime-600/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-stone-900 leading-tight mb-6">
                Transporte
                <span className="block bg-gradient-to-r from-emerald-600 to-lime-600 bg-clip-text text-transparent">
                  Confiable
                </span>
                de Piedra Caliza
              </h1>
              <p className="text-xl text-stone-600 mb-8 leading-relaxed">
                Más de 15 años conectando canteras con la industria peruana.
                Especialistas en logística minera con la mayor flota de
                transporte de piedra caliza del país.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowRegister(true)}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-lime-600 hover:from-emerald-700 hover:to-lime-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-xl flex items-center justify-center space-x-2"
                >
                  <span>Solicitar Cotización</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
                <button className="px-8 py-4 border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-semibold rounded-xl transition-all">
                  Conocer Más
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-emerald-100 to-lime-100 rounded-3xl p-8 shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg"
                  alt="Transporte de piedra caliza"
                  className="w-full h-80 object-cover rounded-2xl shadow-lg"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <CheckCircle className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-bold text-stone-900">98.5%</div>
                    <div className="text-sm text-stone-600">
                      Entregas a Tiempo
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-lime-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-stone-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-stone-900 mb-4">
              Nuestros Servicios
            </h2>
            <p className="text-xl text-stone-600 max-w-3xl mx-auto">
              Ofrecemos soluciones integrales de transporte para la industria
              minera, garantizando calidad y eficiencia en cada envío.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2"
              >
                <div className="bg-gradient-to-br from-emerald-100 to-lime-100 p-4 rounded-2xl w-fit mb-6">
                  <service.icon className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-50 to-lime-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-stone-900 mb-4">
              Lo que Dicen Nuestros Clientes
            </h2>
            <p className="text-xl text-stone-600">
              La confianza de nuestros clientes es nuestro mayor logro
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-stone-600 mb-6 italic">
                  "{testimonial.text}"
                </p>
                <div>
                  <div className="font-bold text-stone-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-stone-500">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold text-stone-900 mb-6">
                Contáctanos
              </h2>
              <p className="text-xl text-stone-600 mb-8">
                Estamos listos para atender sus necesidades de transporte.
                Contáctenos para una cotización personalizada.
              </p>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-stone-900">Teléfono</div>
                    <div className="text-stone-600">+51 1 234-5678</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-stone-900">Email</div>
                    <div className="text-stone-600">contacto@shobol.com</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-stone-900">
                      Dirección
                    </div>
                    <div className="text-stone-600">
                      Av. Industrial 123, Lima, Perú
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-lime-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-stone-900 mb-6">
                Solicitar Información
              </h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nombre"
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Empresa"
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <textarea
                  placeholder="Mensaje"
                  rows={4}
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                ></textarea>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-lime-600 hover:from-emerald-700 hover:to-lime-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
                >
                  Enviar Mensaje
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-br from-emerald-600 to-lime-600 p-2 rounded-xl">
                  <Mountain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">SHOBOL S.A.</h3>
                  <p className="text-stone-400 text-sm">
                    Transporte de Piedra Caliza
                  </p>
                </div>
              </div>
              <p className="text-stone-400 mb-4">
                Líderes en transporte de piedra caliza con más de 15 años de
                experiencia conectando canteras con la industria peruana.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Servicios</h4>
              <ul className="space-y-2 text-stone-400">
                <li>Transporte de Piedra Caliza</li>
                <li>Logística Minera</li>
                <li>Seguimiento GPS</li>
                <li>Consultoría</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-stone-400">
                <li>+51 1 234-5678</li>
                <li>contacto@shobol.com</li>
                <li>Av. Industrial 123</li>
                <li>Lima, Perú</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-800 mt-8 pt-8 text-center text-stone-400">
            <p>&copy; 2024 SHOBOL S.A. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
    </div>
  );
};

export default LandingPage;
