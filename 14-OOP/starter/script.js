class Car 
{
    constructor(make, speed)
    {
        this.make = make;
        this.speed = speed;
    }
    accelerate()
    {
        this.speed += 10;
        return this;
    }
    brake()
    {
        this.speed -= 5;
        return this;
    }
}

class Ev extends Car
{
    #charge;
    constructor(make, speed, charge)
    {
        super(make, speed);
        this.#charge = charge;
    }
    chargeBattery(chargeTo)
    {
        this.#charge = chargeTo;
        return this;
    }
    accelerate()
    {
        this.speed += 20;
        this.#charge -= 1;
        return this;
    }
    getCharge()
    {
        return this.#charge;
    }
}

const tesla = new Ev("Tesla", 200, 90);

tesla.accelerate().accelerate().brake().brake().chargeBattery(100).brake();
tesla.getCharge();//?
tesla;


