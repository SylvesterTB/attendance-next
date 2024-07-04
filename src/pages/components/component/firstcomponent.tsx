import { useState } from 'react';

import { Button } from "@/pages/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover"
import { Command, CommandList, CommandGroup, CommandItem } from "../ui/command"
import { JSX, SVGProps } from "react"
import Image from 'next/image'



export default function FirstComponent() {
  // Initialize example data for "In the Office" and "On Vacation"
  const initialInTheOffice = [
    { id: 1, name: "John Doe", role: "Software Engineer" },
    { id: 2, name: "Jane Smith", role: "Product Manager" },
    { id: 3, name: "Michael Johnson", role: "UI/UX Designer" },
  ];

  const initialOnVacation = [
    { id: 4, name: "Emily Davis", role: "Frontend Developer" },
    { id: 5, name: "David Lee", role: "Backend Developer" },
    { id: 6, name: "Sarah Chen", role: "Project Manager" },
  ];

  // Initialize state for "In the Office" and "On Vacation"
  const [inTheOffice, setInTheOffice] = useState(initialInTheOffice);
  const [onVacation, setOnVacation] = useState(initialOnVacation);

  // Function to move a person to "On Vacation"
  const moveToOnVacation = (person: { id: number; name: string; role: string; }) => {
    console.log(`Moving ${person.name} to On Vacation`);
    // Remove from current list
    setInTheOffice(prev => prev.filter(p => p.id !== person.id));
    // Check if person already exists in onVacation
    if (!onVacation.find(p => p.id === person.id)) {
      setOnVacation(prev => [...prev, person]);
    }
  };
  
  
  const moveBackToOffice = (person: { id: number; name: string; role: string; }) => {
    console.log(`Moving ${person.name} back to In the Office`);
    // Remove from current list
    setOnVacation(prev => prev.filter(p => p.id !== person.id));
    // Check if person already exists in inTheOffice
    if (!inTheOffice.find(p => p.id === person.id)) {
      setInTheOffice(prev => [...prev, person]);
    }
  };
  
  const [newPerson, setNewPerson] = useState({ name: '', role: '', location: 'office' });

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setNewPerson({ ...newPerson, [name]: value });
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const newPersonData = { id: Date.now(), name: newPerson.name, role: newPerson.role };

    if (newPerson.location === 'office') {
      setInTheOffice([...inTheOffice, newPersonData]);
    } else {
      setOnVacation([...onVacation, newPersonData]);
    }

    setNewPerson({ name: '', role: '', location: 'office' });
  };

  const removePerson = (id: number, location: string) => {
    if (location === 'office') {
      setInTheOffice(inTheOffice.filter(person => person.id !== id));
    } else {
      setOnVacation(onVacation.filter(person => person.id !== id));
    }
  };

  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between banner-bg" >
        <Image src="/logo.svg" width={100} height={100} alt='MBLogo' />
        <div className="text-2xl font-bold" style={{ color: 'white'}}>MaibornWolff</div>
        <div className="flex items-center gap-4">
          
          
          <Avatar className="border-2 border-primary-foreground">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </header>
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
        <Card className="bg-card text-card-foreground">
          <CardHeader className="border-b border-card-border pb-4">
            <CardTitle className="text-2xl font-bold">In the Office</CardTitle>
          </CardHeader>
          <CardContent className="py-6">
            <ul className="grid gap-4">
              {inTheOffice.map(person => (
                <li key={person.id} className="flex items-center gap-4">
                  <Avatar className="bg-green-500 text-green-50">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{person.name}</div>
                    <div className="text-sm text-muted-foreground">{person.role}</div>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-muted-foreground">
                        <ChevronDownIcon className="w-4 h-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent onClick={() => moveToOnVacation(person)} className="p-0" align="end" style={{ backgroundColor: 'white' }}>
                      <Command>
                        <CommandList>
                          <CommandGroup>
                          <CommandItem
  className="flex flex-col items-start gap-1 px-4 py-2 cursor-pointer"
>
  <p>Move to "On Vacation"</p>
</CommandItem>
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                    </Popover>
                    <button onClick={() => removePerson(person.id, 'office')} className="text-red-600">
                      Remove
                    </button>
                  
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="bg-card text-card-foreground">
          <CardHeader className="border-b border-card-border pb-4">
            <CardTitle className="text-2xl font-bold">On Vacation</CardTitle>
          </CardHeader>
          <CardContent className="py-6">
            <ul className="grid gap-4">
              {onVacation.map(person => (
                <li key={person.id} className="flex items-center gap-4">
                  <Avatar className="bg-yellow-500 text-yellow-50">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{person.name}</div>
                    <div className="text-sm text-muted-foreground">{person.role}</div>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-muted-foreground">
                        <ChevronDownIcon className="w-4 h-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent  onClick={() => moveBackToOffice(person)} className="p-0" align="end" style={{ backgroundColor: 'white' }}>
                      <Command>
                        <CommandList>
                          <CommandGroup>
                          <CommandItem
  className="flex flex-col items-start gap-1 px-4 py-2 cursor-pointer"
  
>
  <p>Move to "In the Office"</p>
</CommandItem>
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                    </Popover>
                    <button onClick={() => removePerson(person.id, 'vacation')} className="text-red-600">
                      Remove
                    </button>
                  
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </main>
      <footer className="p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            value={newPerson.name}
            onChange={handleInputChange}
            placeholder="Name"
            className="p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            name="role"
            value={newPerson.role}
            onChange={handleInputChange}
            placeholder="Role"
            className="p-2 border border-gray-300 rounded"
            required
          />
          <select
            name="location"
            value={newPerson.location}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="office">In the Office</option>
            <option value="vacation">On Vacation</option>
          </select>
          <button type="submit" className="p-2 bg-primary text-white rounded">
            Add Person
          </button>
        </form>
      </footer>
    </div>
  );
}

function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ChevronUpIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}

function MailsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="13" x="6" y="4" rx="2" />
      <path d="m22 7-7.1 3.78c-.57.3-1.23.3-1.8 0L6 7" />
      <path d="M2 8v11c0 1.1.9 2 2 2h14" />
    </svg>
  );
}

   function SettingsIcon(props: any) {
     return (
       <svg
         {...props}
         xmlns="http://www.w3.org/2000/svg"
         width="24"
         height="24"
         viewBox="0 0 24 24"
         fill="none"
         stroke="currentColor"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
       >
         <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
         <circle cx="12" cy="12" r="3" />
       </svg>
     )
   }
