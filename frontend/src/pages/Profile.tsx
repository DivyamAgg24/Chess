import { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Crown, Trophy, Target, Calendar, Mail, User, Edit2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

interface UserStats {
    rating: number,
    gamesPlayed: number,
    wins: number,
    losses: number,
    draws: number,
    winRate: number,
    joinDate: string
}

interface Game {
    id: string,
    whitePlayer: { name: string, username: string, rating: number },
    blackPlayer: { name: string, username: string, rating: number },
    result: string,
    endAt: Date
}

const Profile = () => {
    const navigate = useNavigate();
    const { user, refreshUser } = useAuth()
    const [isEditing, setIsEditing] = useState(false);
    const [userStats, setUserStats] = useState<UserStats | null>(null)
    const [recentGames, setRecentGames] = useState<Game[]>([])
    const [tab, setTab] = useState<string>("About")
    const [name, setName] = useState(user?.name!)

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!user?.id) {
                    return
                }
                const [statsResponse, gamesResponse] = await Promise.all([
                    axios.get(`/api/user/stats/${user?.id}`, { withCredentials: true }),
                    axios.get(`/api/user/games/${user?.id}?limit=10`, { withCredentials: true })
                ])

                setUserStats(statsResponse.data)
                setRecentGames(gamesResponse.data)
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData()
    }, [user?.id])

    const updateName = async () => {
        try {
            if (!user?.id) {
                return
            }

            const response = await axios.post(`/api/user/updateName/${user?.id}`, {
                name: name
            }, { withCredentials: true })

            await refreshUser()
        } catch (error) {
            console.error("Error updating name", error)
        }

    }

    const stats = [
        { icon: Trophy, label: "Rating", value: userStats?.rating, color: "text-primary" },
        { icon: Target, label: "Games Played", value: userStats?.gamesPlayed, color: "text-primary" },
        { icon: Crown, label: "Win Rate", value: `${userStats?.winRate}%`, color: "text-primary" },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-card">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
                        <Button variant="outline" onClick={() => navigate("/")}>
                            Back to Home
                        </Button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Profile Header Card */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                                <div className="h-32 w-32 relative flex shrink-0 overflow-hidden rounded-full">
                                    <img src="/user-image.007dad08.svg" alt={user?.name!} className="aspect-square h-full w-full" />

                                </div>

                                <div className="flex-1 text-center md:text-left space-y-4">
                                    <div>
                                        <h2 className="text-3xl font-bold text-foreground">{user?.name}</h2>
                                        <p className="text-muted-foreground">@{user?.email}</p>
                                    </div>

                                    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                        {stats.map((stat, index) => (
                                            <div key={index} className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg">
                                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                                                <div>
                                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                                    <p className="text-lg font-semibold text-foreground">{stat.value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Button
                                    variant={isEditing ? "secondary" : "default"}
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="gap-2"
                                >
                                    <Edit2 className="h-4 w-4" />
                                    {isEditing ? "Cancel" : "Edit Profile"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tabs Section */}
                    <div className="w-full space-y-4">
                        <div className="w-full h-10 inline-flex items-center justify-center rounded-md bg-muted text-muted-foreground p-1">
                            <div className="grid w-full grid-cols-3 place-items-center gap-x-3 mx-2">
                                <div className={`w-full ${tab === "About" ? "bg-white" : ""} rounded inline-flex justify-center cursor-pointer`} onClick={() => { setTab("About") }}>About</div>
                                <div className={`w-full ${tab === "Statistics" ? "bg-white" : ""} rounded inline-flex justify-center cursor-pointer`} onClick={() => { setTab("Statistics") }}>Statistics</div>
                                <div className={`w-full ${tab === "Achievements" ? "bg-white" : ""} rounded inline-flex justify-center cursor-pointer`} onClick={() => { setTab("Achievements") }}>Achievements</div>
                            </div>
                        </div>

                        {tab === "About" && <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Personal Information</CardTitle>
                                    <CardDescription>Your account details and bio</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            Full Name
                                        </label>
                                        <input
                                            id="name"
                                            value={name}
                                            disabled={!isEditing}
                                            onChange={(e) => (setName(e.target.value))}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                        />
                                    </div>

                                    {isEditing && (
                                        <Button className="w-full" onClick={updateName}>Save Changes</Button>
                                    )}
                                </CardContent>
                            </Card>
                        </div>}

                        {tab === "Statistics" && <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Game Statistics</CardTitle>
                                    <CardDescription>Your performance overview</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center p-4 bg-secondary rounded-lg">
                                                <span className="text-muted-foreground">Total Games</span>
                                                <span className="text-2xl font-bold text-foreground">{userStats?.gamesPlayed}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-4 bg-secondary rounded-lg">
                                                <span className="text-muted-foreground">Wins</span>
                                                <span className="text-2xl font-bold text-foreground">{userStats?.wins}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-4 bg-secondary rounded-lg">
                                                <span className="text-muted-foreground">Draws</span>
                                                <span className="text-2xl font-bold text-foreground">{userStats?.draws}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center p-4 bg-secondary rounded-lg">
                                                <span className="text-muted-foreground">Losses</span>
                                                <span className="text-2xl font-bold text-foreground">{userStats?.losses}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-4 bg-secondary rounded-lg">
                                                <span className="text-muted-foreground">Win Rate</span>
                                                <span className="text-2xl font-bold text-primary">{userStats?.winRate}%</span>
                                            </div>
                                            <div className="flex justify-between items-center p-4 bg-secondary rounded-lg">
                                                <span className="text-muted-foreground flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    Member Since
                                                </span>
                                                <span className="text-lg font-semibold text-foreground">{userStats?.joinDate}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>}

                        {tab === "Achievements" && <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Achievements & Milestones</CardTitle>
                                    <CardDescription>Your chess journey highlights</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { title: "First Victory", desc: "Won your first game", icon: Trophy },
                                            { title: "Century Club", desc: "Played 100+ games", icon: Target },
                                            { title: "Rising Star", desc: "Reached 1800 rating", icon: Crown },
                                            { title: "Puzzle Master", desc: "Solved 500 puzzles", icon: Target },
                                        ].map((achievement, index) => (
                                            <div key={index} className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-accent transition-colors">
                                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <achievement.icon className="h-6 w-6 text-primary" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-foreground">{achievement.title}</h4>
                                                    <p className="text-sm text-muted-foreground">{achievement.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
