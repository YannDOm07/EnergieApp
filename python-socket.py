import asyncio
import websockets
import json
from datetime import datetime

class DeviceMonitorServer:
    def __init__(self):
        self.clients = set()
        self.device_data = {}
        self.device_status = {}
        self.active_devices_power = {}
        self.current_voltage = None
        self.last_activity = datetime.now()
        self.connection_timeout = 10  # Timeout en secondes

    def get_moment_of_day(self):
        """Détermine le moment de la journée basé sur l'heure actuelle"""
        current_hour = datetime.now().hour

        if 5 <= current_hour < 8:
            return "Aube"
        elif 8 <= current_hour < 12:
            return "Matinée"
        elif 12 <= current_hour < 14:
            return "Début après-midi"
        elif 14 <= current_hour < 18:
            return "Fin après-midi"
        elif 18 <= current_hour < 21:
            return "Soirée"
        elif 21 <= current_hour < 23:
            return "Nuit"
        else:
            return "Très tôt"

    def get_detailed_time_info(self):
        """Retourne des informations temporelles détaillées"""
        now = datetime.now()
        return {
            'timestamp': now.strftime('%Y-%m-%d %H:%M:%S'),
            'date': now.strftime('%Y-%m-%d'),
            'time': now.strftime('%H:%M:%S'),
            'hour': now.hour,
            'minute': now.minute,
            'weekday': now.weekday(),
            'day_name': now.strftime('%A'),
            'moment_de_la_journee': self.get_moment_of_day(),
            'is_weekend': now.weekday() >= 5
        }

    async def register_client(self, websocket):
        """Enregistre un nouveau client"""
        self.clients.add(websocket)
        print(f"✅ Client connecté. Total: {len(self.clients)}")

        # Envoyer les données existantes au nouveau client
        if self.device_data:
            time_info = self.get_detailed_time_info()
            total_power = self.calculate_total_power()[0]
            try:
                await websocket.send(json.dumps({
                    'type': 'initial_data',
                    'data': self.device_data,
                    'status': self.device_status,
                    'time_info': time_info,
                    'Consommation_totale(W)': total_power,
                    'Voltage(V)': self.current_voltage # Inclure la tension ici
                }))
            except Exception as e:
                print(f"❌ Erreur envoi données initiales: {e}")

    async def unregister_client(self, websocket):
        """Désenregistre un client"""
        self.clients.discard(websocket)
        print(f"❌ Client déconnecté. Total: {len(self.clients)}")

    def calculate_total_power(self):
        """Calcule la puissance totale des appareils actifs"""
        total_power = 0
        active_count = 0

        for device_name, status in self.device_status.items():
            if status in ['activated', 'running']:
                power = self.active_devices_power.get(device_name, 0)
                total_power += power
                active_count += 1

        return total_power, active_count

    def format_timestamp(self):
        """Retourne un timestamp formaté avec date et heure complète"""
        return datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    def display_active_devices_list(self):
        """Affiche la liste complète des appareils actifs avec moment et tension"""
        time_info = self.get_detailed_time_info()

        if self.active_devices_power:
            print("┌" + "─" * 78 + "┐")
            print("│" + " " * 25 + "APPAREILS ACTIFS" + " " * 25 + "│")
            print("├" + "─" * 78 + "┤")
            print(f"│ 🕐 Moment: {time_info['moment_de_la_journee']:<15} │ 📅 {time_info['day_name']:<20} │")
            # Ajout de l'affichage de la tension
            voltage_display = f"{self.current_voltage}V" if self.current_voltage is not None else "N/A"
            print(f"│ ⚡ Tension: {voltage_display:<15} " + " " * 36 + "│")
            print("├" + "─" * 78 + "┤")

            total_power = 0
            for device_name, power in self.active_devices_power.items():
                device_display = f"│ 🟢 {device_name.upper():<20} │ {power:>6}W │"
                remaining_space = 78 - len(device_display) + 1
                print(device_display + " " * remaining_space + "│")
                total_power += power

            print("├" + "─" * 78 + "┤")
            total_display = f"│ 📊 TOTAL CONSOMMATION:" + f"{total_power:>6}W" + " " * 33 + "│"
            print(total_display)
            print("└" + "─" * 78 + "┘")
        else:
            print("┌" + "─" * 78 + "┐")
            print("│" + " " * 22 + "AUCUN APPAREIL ACTIF" + " " * 22 + "│")
            print("├" + "─" * 78 + "┤")
            print(f"│ 🕐 Moment: {time_info['moment_de_la_journee']:<15} │ 📅 {time_info['day_name']:<20} │")
            # Ajout de l'affichage de la tension même sans appareils actifs
            voltage_display = f"{self.current_voltage}V" if self.current_voltage is not None else "N/A"
            print(f"│ ⚡ Tension: {voltage_display:<15} " + " " * 36 + "│")
            print("└" + "─" * 78 + "┘")

    def get_dataset_format_data(self):
        """Retourne les données au format du dataset incluant la tension."""
        time_info = self.get_detailed_time_info()

        dataset_appareils = [
            "Réfrigérateur", "Téléviseur (LED)", "Fer à repasser",
            "Four électrique", "Console de jeux"
        ]

        dataset_format = {
            'timestamp': time_info['timestamp'],
            'moment_de_la_journee': time_info['moment_de_la_journee'],
            'Voltage(V)': self.current_voltage # Inclure la tension ici
        }

        total_power = 0

        for appareil in dataset_appareils:
            power = 0
            for device_name, device_power in self.active_devices_power.items():
                if device_name.lower() == appareil.lower():
                    power = device_power
                    break

            dataset_format[appareil] = power
            total_power += power

        dataset_format['Consommation_totale(W)'] = total_power

        return dataset_format

    async def check_connection_health(self):
        """Surveille l'état de la connexion et des données"""
        while True:
            try:
                await asyncio.sleep(5)
                now = datetime.now()
                time_diff = (now - self.last_activity).total_seconds()

                if time_diff > self.connection_timeout:
                    print(f"⚠️ Aucune donnée reçue depuis {time_diff:.1f} secondes")
                    # Tentative de reconnexion ou notification
                    await self.handle_connection_timeout()

            except Exception as e:
                print(f"❌ Erreur surveillance connexion: {e}")

    async def handle_connection_timeout(self):
        """Gère les timeouts de connexion"""
        try:
            # Notifier tous les clients
            timeout_message = {
                'type': 'connection_status',
                'status': 'timeout',
                'last_activity': self.last_activity.strftime('%Y-%m-%d %H:%M:%S'),
                'message': 'Connexion inactive - Tentative de reconnexion'
            }
            await self.broadcast(json.dumps(timeout_message))

            # Réinitialiser les connexions si nécessaire
            for client in self.clients.copy():
                try:
                    await client.ping()
                except:
                    await self.unregister_client(client)
                    print("🔌 Client déconnecté après timeout")

        except Exception as e:
            print(f"❌ Erreur gestion timeout: {e}")

    async def handle_device_data(self, data):
        """Gère les données reçues des appareils"""
        try:
            # Mettre à jour le timestamp de dernière activité
            self.last_activity = datetime.now()

            print(f"📨 Données reçues: {data}")

            device_info = json.loads(data)

            # --- MODIFICATION CLÉ ICI ---
            # Vérifier si c'est un 'complete_dataset' et mettre à jour active_devices_power en conséquence
            if device_info.get('type') == 'complete_dataset':
                dataset_format = device_info.get('dataset_format', {})
                # Réinitialiser active_devices_power pour refléter l'état complet du dataset
                self.active_devices_power = {}
                for device_name_key, power_value in dataset_format.items():
                    if device_name_key not in ['timestamp', 'moment_de_la_journee', 'Consommation_totale(W)', 'Voltage(V)']: # Exclure aussi 'Voltage(V)'
                        # Nettoyer le nom de l'appareil si nécessaire (ex: enlever les \u00e9)
                        clean_device_name = device_name_key.replace('\u00e9', 'é')
                        if power_value > 0:
                            self.active_devices_power[clean_device_name] = power_value
                            self.device_status[clean_device_name] = 'running'
                        else:
                            self.device_status[clean_device_name] = 'deactivated'

                # Récupérer la tension du dataset et la stocker
                self.current_voltage = dataset_format.get('Voltage(V)')

                # Utiliser la puissance totale du dataset si elle est disponible
                total_power = dataset_format.get('Consommation_totale(W)', 0)
                active_count = len(self.active_devices_power)
                moment = dataset_format.get('moment_de_la_journee')
                timestamp = dataset_format.get('timestamp')

                # Imprimer l'information basée sur le dataset, incluant la tension
                print(f"📨 [{timestamp}] {moment} | DATASET COMPLET REÇU | CONSOMMATION TOTALE: {total_power}W | TENSION: {self.current_voltage}V")

            else: # C'est un 'device_update' d'un seul appareil
                device_name = device_info.get('device', 'unknown')
                status = device_info.get('status', 'unknown')
                power = device_info.get('power', 0)
                is_periodic = device_info.get('periodic', False)

                time_info = self.get_detailed_time_info()

                device_info['received_at'] = time_info['timestamp']
                device_info['moment_de_la_journee'] = time_info['moment_de_la_journee']
                device_info['day_name'] = time_info['day_name']
                device_info['is_weekend'] = time_info['is_weekend']
                device_info['hour'] = time_info['hour']

                self.device_data[device_name] = device_info
                self.device_status[device_name] = status

                # Mettre à jour la puissance des appareils actifs pour les messages individuels
                if status in ['activated', 'running']:
                    self.active_devices_power[device_name] = power
                    print(f"🟢 Appareil activé: {device_name} ({power}W)")
                elif status == 'deactivated':
                    if device_name in self.active_devices_power:
                        del self.active_devices_power[device_name]
                    print(f"🔴 Appareil désactivé: {device_name}")

                total_power, active_count = self.calculate_total_power() # Recalculer après mise à jour individuelle

                timestamp = time_info['timestamp']
                moment = time_info['moment_de_la_journee']

                if status == 'activated':
                    print(f"🟢 [{timestamp}] {moment} | APPAREIL: {device_name.upper()} | PUISSANCE: {power}W | STATUT: ACTIVÉ")
                elif status == 'deactivated':
                    print(f"🔴 [{timestamp}] {moment} | APPAREIL: {device_name.upper()} | PUISSANCE: {power}W | STATUT: DÉSACTIVÉ")
                elif status == 'running' and is_periodic:
                    print(f"📡 [{timestamp}] {moment} | APPAREIL: {device_name.upper()} | PUISSANCE: {power}W | STATUT: FONCTIONNEMENT")
                else:
                    print(f"ℹ [{timestamp}] {moment} | APPAREIL: {device_name.upper()} | PUISSANCE: {power}W | STATUT: {status}")

            # --- Cette partie s'exécute après le traitement 'complete_dataset' ou 'device_update' ---
            self.display_active_devices_list() # L'affichage devrait maintenant être correct
            print() # Pour une meilleure lisibilité

            dataset_format_data = self.get_dataset_format_data() # Générer à nouveau pour s'assurer que c'est à jour pour le broadcast

            if self.clients:
                broadcast_data = {
                    'type': 'device_update' if device_info.get('type') != 'complete_dataset' else 'complete_dataset_update',
                    'data': device_info,
                    'total_power': total_power,
                    'active_devices_count': active_count,
                    'active_devices_list': self.active_devices_power.copy(),
                    'time_info': self.get_detailed_time_info(),
                    'dataset_format': dataset_format_data,
                    'Consommation_totale(W)': total_power,
                    'Voltage(V)': self.current_voltage # Inclure la tension dans le broadcast
                }
                await self.broadcast(json.dumps(broadcast_data))

        except json.JSONDecodeError as e:
            print(f"❌ Erreur JSON: {e} - Données reçues: {data}")
        except Exception as e:
            print(f"❌ Erreur traitement: {e}")

    async def broadcast(self, message):
        """Diffuse un message à tous les clients connectés"""
        if self.clients:
            disconnected = set()
            for client in self.clients.copy():
                try:
                    await client.send(message)
                except websockets.exceptions.ConnectionClosed:
                    disconnected.add(client)
                    print("🔌 Client déconnecté lors du broadcast")
                except Exception as e:
                    print(f"❌ Erreur broadcast: {e}")
                    disconnected.add(client)

            # Nettoyer les clients déconnectés
            for client in disconnected:
                self.clients.discard(client)

    async def handle_client(self, websocket, path=None):
        """Gère une connexion client"""
        print(f"🔗 Nouvelle connexion depuis {websocket.remote_address}")
        await self.register_client(websocket)
        try:
            async for message in websocket:
                await self.handle_device_data(message)
        except websockets.exceptions.ConnectionClosed:
            print("🔌 Connexion fermée normalement")
        except Exception as e:
            print(f"❌ Erreur connexion client: {e}")
        finally:
            await self.unregister_client(websocket)

    async def send_periodic_summary(self):
        """Envoie un résumé périodique des appareils, incluant la tension."""
        while True:
            try:
                await asyncio.sleep(60)
                total_power, active_count = self.calculate_total_power()
                time_info = self.get_detailed_time_info()
                dataset_format_data = self.get_dataset_format_data()

                # S'assurer que le voltage est inclus dans le dataset_format_data généré
                dataset_format_data['Voltage(V)'] = self.current_voltage

                if active_count > 0:
                    active_devices_list = list(self.active_devices_power.keys())

                    summary = {
                        'type': 'summary',
                        'total_devices': len(self.device_data),
                        'active_devices': active_count,
                        'total_power': total_power,
                        'time_info': time_info,
                        'active_device_names': active_devices_list,
                        'devices_power_detail': self.active_devices_power.copy(),
                        'dataset_format': dataset_format_data,
                        'Consommation_totale(W)': total_power,
                        'Voltage(V)': self.current_voltage # Inclure la tension ici
                    }

                    print("=" * 80)
                    print(f"📋 RÉSUMÉ PÉRIODIQUE [{time_info['timestamp']}] - {time_info['moment_de_la_journee']}")
                    print("=" * 80)
                    self.display_active_devices_list() # Cette fonction affiche déjà la tension maintenant
                    print("=" * 80)

                    await self.broadcast(json.dumps(summary))
                else:
                    print("=" * 80)
                    print(f"📋 RÉSUMÉ PÉRIODIQUE [{time_info['timestamp']}] - {time_info['moment_de_la_journee']}")
                    self.display_active_devices_list() # Cette fonction affiche déjà la tension maintenant
                    print("=" * 80)
            except Exception as e:
                print(f"❌ Erreur résumé périodique: {e}")

    def display_current_status(self):
        """Affiche le statut actuel de tous les appareils, incluant la tension."""
        time_info = self.get_detailed_time_info()
        total_power, active_count = self.calculate_total_power()

        print("\n" + "=" * 80)
        print(f"STATUT ACTUEL [{time_info['timestamp']}] - {time_info['moment_de_la_journee']}")
        print("=" * 80)

        # Affichage de la tension dans le statut général
        voltage_display = f"{self.current_voltage}V" if self.current_voltage is not None else "N/A"
        print(f"⚡ TENSION ACTUELLE: {voltage_display}")
        print("-" * 80)

        if self.device_status:
            for device_name, status in self.device_status.items():
                power = self.device_data.get(device_name, {}).get('power', 0)
                if status in ['activated', 'running']:
                    current_power = self.active_devices_power.get(device_name, power)
                    print(f"🟢 {device_name.upper()}: {status.upper()} ({current_power}W)")
                else:
                    print(f"🔴 {device_name.upper()}: {status.upper()} (0W)")
        else:
            print("Aucun appareil détecté")

        print("-" * 80)
        print(f"📊 PUISSANCE TOTALE: {total_power}W ({active_count} appareils actifs)")
        print(f"🕐 MOMENT: {time_info['moment_de_la_journee']} | 📅 {time_info['day_name']}")
        print("=" * 80 + "\n")

    async def start_server(self, host='0.0.0.0', port=8765):
        """Démarre le serveur WebSocket"""
        time_info = self.get_detailed_time_info()

        print("🚀 SERVEUR WEBSOCKET - MONITORING DES APPAREILS")
        print("=" * 80)
        print(f"📡 Serveur démarré sur {host}:{port}")
        print(f"🕐 Démarrage: {time_info['timestamp']} ({time_info['moment_de_la_journee']})")
        print(f"📅 Jour: {time_info['day_name']} {'(Week-end)' if time_info['is_weekend'] else '(Semaine)'}")
        print("=" * 80)

        try:
            async with websockets.serve(self.handle_client, host, port):
                print(f"✅ Serveur en écoute sur ws://{host}:{port}")

                # Créer les tâches de surveillance
                summary_task = asyncio.create_task(self.send_periodic_summary())
                health_check_task = asyncio.create_task(self.check_connection_health())

                try:
                    # Attendre toutes les tâches
                    await asyncio.gather(summary_task, health_check_task)
                except asyncio.CancelledError:
                    summary_task.cancel()
                    health_check_task.cancel()
                    print("🛑 Arrêt du serveur")
        except Exception as e:
            print(f"❌ Erreur démarrage serveur: {e}")

# Point d'entrée principal
async def main():
    """Point d'entrée principal"""
    server = DeviceMonitorServer()
    await server.start_server(host='0.0.0.0', port=8765)

if _name_ == "_main_":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n🛑 Arrêt du serveur par l'utilisateur")
    except Exception as e:
        print(f"❌ Erreur fatale: {e}")
