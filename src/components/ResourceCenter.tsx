import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CROPS, ANIMALS, BUILDINGS, TECH_TREE, ACHIEVEMENTS } from '@/lib/gameData'
import { Info, TreeStructure, Farm, Factory, Trophy, Sparkle, DiceSix } from '@phosphor-icons/react'

export function ResourceCenter() {
  const [selectedTab, setSelectedTab] = useState('guide')

  return (
    <div className="h-full">
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="guide" className="text-xs">
            <Info className="w-4 h-4 mr-1" />
            Guide
          </TabsTrigger>
          <TabsTrigger value="crops" className="text-xs">
            <Farm className="w-4 h-4 mr-1" />
            Crops
          </TabsTrigger>
          <TabsTrigger value="animals" className="text-xs">
            🐄
          </TabsTrigger>
          <TabsTrigger value="buildings" className="text-xs">
            <Factory className="w-4 h-4 mr-1" />
            Build
          </TabsTrigger>
          <TabsTrigger value="tech" className="text-xs">
            <TreeStructure className="w-4 h-4 mr-1" />
            Tech
          </TabsTrigger>
          <TabsTrigger value="achievements" className="text-xs">
            <Trophy className="w-4 h-4 mr-1" />
            Goals
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden mt-3">
          <TabsContent value="guide" className="h-full m-0">
            <ScrollArea className="h-full">
              <div className="space-y-4 pr-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Sparkle weight="fill" className="text-primary" />
                      Welcome to Farm Empire
                    </CardTitle>
                    <CardDescription>Build the ultimate farming dynasty</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <p>
                      Start by planting crops on empty plots. Click any empty plot to open the placement menu
                      and choose what to plant or build.
                    </p>
                    <p>
                      Each crop has different costs, grow times, and rewards. Experiment to find the most
                      profitable strategy for your farm!
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <DiceSix weight="fill" className="text-amber-500" />
                      Harvest Roll System
                    </CardTitle>
                    <CardDescription>Every harvest is a gamble!</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <p>
                      When you harvest a crop, the game rolls a dice to determine your yield bonus:
                    </p>
                    <ul className="space-y-2 ml-4">
                      <li className="flex items-start gap-2">
                        <Badge variant="outline" className="mt-0.5">75-150%</Badge>
                        <span>Normal harvests - your base yield multiplied by the roll</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Badge className="mt-0.5 bg-amber-500">150-200%</Badge>
                        <span>Critical harvests - rare, high-value yields with special animation!</span>
                      </li>
                    </ul>
                    <Separator className="my-3" />
                    <p className="font-semibold">💡 Pro Tip:</p>
                    <p>
                      Unlock <span className="text-primary font-semibold">Luck techs</span> to increase your critical
                      harvest chance and improve your roll ranges. The more luck you have, the better your average yields!
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Resource Types</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="font-semibold text-amber-600">Gold 💰</p>
                        <p className="text-xs text-muted-foreground">Primary currency</p>
                      </div>
                      <div>
                        <p className="font-semibold text-green-600">Seeds 🌱</p>
                        <p className="text-xs text-muted-foreground">Plant crops</p>
                      </div>
                      <div>
                        <p className="font-semibold text-blue-600">Water 💧</p>
                        <p className="text-xs text-muted-foreground">Grow crops</p>
                      </div>
                      <div>
                        <p className="font-semibold text-amber-700">Fertilizer 🌿</p>
                        <p className="text-xs text-muted-foreground">Boost growth</p>
                      </div>
                      <div>
                        <p className="font-semibold text-yellow-500">Energy ⚡</p>
                        <p className="text-xs text-muted-foreground">Power buildings</p>
                      </div>
                      <div>
                        <p className="font-semibold text-purple-600">Research 🔬</p>
                        <p className="text-xs text-muted-foreground">Unlock tech</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Progression Path</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <ol className="space-y-2 ml-4 list-decimal">
                      <li>Plant basic crops (Wheat, Corn) to earn gold and resources</li>
                      <li>Harvest crops when ready and watch for lucky rolls!</li>
                      <li>Unlock technologies with research points</li>
                      <li>Expand with animals and buildings for passive income</li>
                      <li>Complete achievements for bonus rewards</li>
                      <li>Maximize your luck to get consistent critical harvests</li>
                    </ol>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tips & Strategies</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <ul className="space-y-2 ml-4 list-disc">
                      <li>Early game: Focus on wheat and corn for steady income</li>
                      <li>Save research points for key technologies</li>
                      <li>Prioritize luck upgrades for better average yields</li>
                      <li>Buildings provide passive resource generation</li>
                      <li>Animals need regular feeding but give steady returns</li>
                      <li>Diversify your farm for achievement bonuses</li>
                      <li>The dice roll adds variance - sometimes you'll get amazing yields!</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="crops" className="h-full m-0">
            <ScrollArea className="h-full">
              <div className="space-y-3 pr-4">
                {CROPS.map(crop => (
                  <Card key={crop.id}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <span className="text-2xl">{crop.icon}</span>
                        {crop.name}
                        <Badge variant="outline" className="ml-auto">Tier {crop.tier}</Badge>
                      </CardTitle>
                      <CardDescription>{crop.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div>
                        <p className="font-semibold mb-1">Cost:</p>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(crop.cost).map(([key, value]) => (
                            <Badge key={key} variant="secondary">{value} {key}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold mb-1">Yield (base):</p>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(crop.yield).map(([key, value]) => (
                            <Badge key={key} className="bg-green-600">{value} {key}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold">Grow Time: <span className="font-normal">{(crop.growTime / 1000).toFixed(1)}s</span></p>
                      </div>
                      {crop.requiredTech && (
                        <Badge variant="outline" className="text-xs">
                          Requires: {TECH_TREE.find(t => t.id === crop.requiredTech)?.name || crop.requiredTech}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="animals" className="h-full m-0">
            <ScrollArea className="h-full">
              <div className="space-y-3 pr-4">
                {ANIMALS.map(animal => (
                  <Card key={animal.id}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <span className="text-2xl">{animal.icon}</span>
                        {animal.name}
                        <Badge variant="outline" className="ml-auto">Tier {animal.tier}</Badge>
                      </CardTitle>
                      <CardDescription>{animal.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div>
                        <p className="font-semibold mb-1">Purchase Cost:</p>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(animal.cost).map(([key, value]) => (
                            <Badge key={key} variant="secondary">{value} {key}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold mb-1">Feed Cost:</p>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(animal.feedCost).map(([key, value]) => (
                            <Badge key={key} variant="outline">{value} {key}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold mb-1">Production:</p>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(animal.production).map(([key, value]) => (
                            <Badge key={key} className="bg-blue-600">{value} {key}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-xs"><span className="font-semibold">Feed every:</span> {(animal.feedInterval / 1000).toFixed(0)}s</p>
                        <p className="text-xs"><span className="font-semibold">Produces every:</span> {(animal.productionInterval / 1000).toFixed(0)}s</p>
                      </div>
                      {animal.requiredTech && (
                        <Badge variant="outline" className="text-xs">
                          Requires: {TECH_TREE.find(t => t.id === animal.requiredTech)?.name || animal.requiredTech}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="buildings" className="h-full m-0">
            <ScrollArea className="h-full">
              <div className="space-y-3 pr-4">
                {BUILDINGS.map(building => (
                  <Card key={building.id}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <span className="text-2xl">{building.icon}</span>
                        {building.name}
                        <Badge variant="outline" className="ml-auto">Tier {building.tier}</Badge>
                      </CardTitle>
                      <CardDescription>{building.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div>
                        <p className="font-semibold mb-1">Cost:</p>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(building.cost).map(([key, value]) => (
                            <Badge key={key} variant="secondary">{value} {key}</Badge>
                          ))}
                        </div>
                      </div>
                      {building.production && Object.keys(building.production).length > 0 && (
                        <div>
                          <p className="font-semibold mb-1">Produces:</p>
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(building.production).map(([key, value]) => (
                              <Badge key={key} className="bg-purple-600">{value} {key}</Badge>
                            ))}
                          </div>
                          <p className="text-xs mt-1">Every {(building.productionRate / 1000).toFixed(0)}s</p>
                        </div>
                      )}
                      {building.requiredTech && (
                        <Badge variant="outline" className="text-xs">
                          Requires: {TECH_TREE.find(t => t.id === building.requiredTech)?.name || building.requiredTech}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="tech" className="h-full m-0">
            <ScrollArea className="h-full">
              <div className="space-y-3 pr-4">
                {TECH_TREE.map(tech => (
                  <Card key={tech.id}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        {tech.name}
                        <Badge variant="outline" className="ml-auto">
                          {tech.cost} 🔬
                        </Badge>
                      </CardTitle>
                      <CardDescription>{tech.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <Badge className="bg-purple-600">{tech.category}</Badge>
                      {tech.prerequisites.length > 0 && (
                        <div>
                          <p className="font-semibold mb-1 text-xs">Prerequisites:</p>
                          <div className="flex flex-wrap gap-1">
                            {tech.prerequisites.map(prereq => {
                              const prereqTech = TECH_TREE.find(t => t.id === prereq)
                              return (
                                <Badge key={prereq} variant="outline" className="text-xs">
                                  {prereqTech?.name || prereq}
                                </Badge>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="achievements" className="h-full m-0">
            <ScrollArea className="h-full">
              <div className="space-y-3 pr-4">
                {ACHIEVEMENTS.map(achievement => (
                  <Card key={achievement.id}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Trophy weight="fill" className={`w-5 h-5 ${
                          achievement.tier === 1 ? 'text-amber-600' :
                          achievement.tier === 2 ? 'text-gray-400' :
                          'text-amber-500'
                        }`} />
                        {achievement.name}
                      </CardTitle>
                      <CardDescription>{achievement.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{achievement.category}</Badge>
                        <Badge variant="outline">Requirement: {achievement.requirement}</Badge>
                      </div>
                      <div>
                        <p className="font-semibold mb-1 text-xs">Reward:</p>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(achievement.reward).map(([key, value]) => (
                            <Badge key={key} className="bg-green-600 text-xs">{value} {key}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
