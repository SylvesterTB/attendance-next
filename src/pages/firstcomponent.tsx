import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandList, CommandGroup, CommandItem } from "@/components/ui/command";
import { JSX, SVGProps } from "react";
import Image from 'next/image';
import { firestore } from 'lib/firebase';  // Import Firestore
import { doc, getDoc, setDoc } from 'firebase/firestore';  // Import Firestore functions
interface NewPerson {
  name: string;
  role: string;
  location: 'office' | 'vacation';
}

interface Person {
  id: number;
  name: string;
  role: string;
}
export default function FirstComponent() {
  // Initialize state for "In the Office" and "On Vacation"
  const [loading, setLoading] = useState(true);
  const [inTheOffice, setInTheOffice] = useState<Person[]>([]);
const [onVacation, setOnVacation] = useState<Person[]>([]);

  // Function to fetch data from Firestore
  const fetchData = async () => {
    const docRef = doc(firestore, 'positions', 'positionsData');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setInTheOffice(data.inTheOffice || []);
      setOnVacation(data.onVacation || []);
    } else {
      setInTheOffice([]);
      setOnVacation([]);
    }
    setLoading(false); // Set loading to false after data is fetched
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Function to save data to Firestore
  const saveData = async (inTheOfficeData: any[], onVacationData: { id: number; name: string; role: string; }[]) => {
    const docRef = doc(firestore, 'positions', 'positionsData');
    await setDoc(docRef, {
      inTheOffice: inTheOfficeData,
      onVacation: onVacationData,
    });
  };

  // Function to move a person to "On Vacation"
  const moveToOnVacation = (person: Person) => {
    const updatedInTheOffice = inTheOffice.filter(p => p.id !== person.id);
    const updatedOnVacation = [...onVacation, person];
    setInTheOffice(updatedInTheOffice);
    setOnVacation(updatedOnVacation);
    saveData(updatedInTheOffice, updatedOnVacation);  // Save data after update
  };

  // Function to move a person back to "In the Office"
  const moveBackToOffice = (person: Person) => {
    const updatedOnVacation = onVacation.filter(p => p.id !== person.id);
    const updatedInTheOffice = [...inTheOffice, person];
    setOnVacation(updatedOnVacation);
    setInTheOffice(updatedInTheOffice);
    saveData(updatedInTheOffice, updatedOnVacation);  // Save data after update
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
      const updatedInTheOffice = [...inTheOffice, newPersonData];
      setInTheOffice(updatedInTheOffice);
      saveData(updatedInTheOffice, onVacation);  // Save data after update
    } else {
      const updatedOnVacation = [...onVacation, newPersonData];
      setOnVacation(updatedOnVacation);
      saveData(inTheOffice, updatedOnVacation);  // Save data after update
    }

    setNewPerson({ name: '', role: '', location: 'office' });
  };

  const removePerson = (id: any, location: string) => {
    if (location === 'office') {
      const updatedInTheOffice = inTheOffice.filter(person => person.id !== id);
      setInTheOffice(updatedInTheOffice);
      saveData(updatedInTheOffice, onVacation);  // Save data after update
    } else {
      const updatedOnVacation = onVacation.filter(person => person.id !== id);
      setOnVacation(updatedOnVacation);
      saveData(inTheOffice, updatedOnVacation);  // Save data after update
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <img src="/loadin-icon.jpg" style={{ width: 160, height: 120 }} alt='loading' />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between banner-bg">
        <Image src="/logo.svg" width={100} height={100} alt='MBLogo' />
        <div className="text-2xl font-bold" style={{ color: 'white' }}>MaibornWolff</div>
        <div className="flex items-center gap-4">
          <Avatar className="border-2 border-primary-foreground">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </header>
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
        <Card className="bg-card text-card-foreground rounded-lg shadow-md max-h-[60vh] overflow-auto">
          <CardHeader className="sticky top-0 bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between banner-bg">
            <CardTitle className="text-2xl font-bold">In the Office</CardTitle>
          </CardHeader>
          <CardContent className="py-6">
            <ul className="grid gap-4">
              {inTheOffice.map(person => (
                <li key={person.id} className="flex items-center gap-4 p-4 rounded-lg shadow-sm">
                  <Avatar className="bg-green-500 text-green-50 rounded-full shadow-sm">
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
                            <CommandItem className="flex flex-col items-start gap-1 px-4 py-2 cursor-pointer">
                              <p>Move to &quot;On Vacation&quot;</p>
                            </CommandItem>
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <button onClick={() => removePerson(person.id, 'office')} className="text-red-600">Remove</button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="bg-card text-card-foreground rounded-lg shadow-md max-h-[60vh] overflow-auto">
          <CardHeader className="sticky top-0 bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between banner-bg">
            <CardTitle className="text-2xl font-bold">On Vacation</CardTitle>
          </CardHeader>
          <CardContent className="py-6 overflow-auto">
            <ul className="grid gap-4">
              {onVacation.map(person => (
                <li key={person.id} className="flex items-center gap-4 p-4 rounded-lg shadow-sm">
                  <Avatar className="bg-yellow-500 text-yellow-50 rounded-full shadow-sm">
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
                    <PopoverContent onClick={() => moveBackToOffice(person)} className="p-0" align="end" style={{ backgroundColor: 'white' }}>
                      <Command>
                        <CommandList>
                          <CommandGroup>
                            <CommandItem className="flex flex-col items-start gap-1 px-4 py-2 cursor-pointer">
                              <p>Move to &quot;In the Office&quot;</p>
                            </CommandItem>
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <button onClick={() => removePerson(person.id, 'vacation')} className="text-red-600">Remove</button>
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
          <button type="submit" className="p-2 bg-primary text-white rounded-lg shadow-md">
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
  );
}
