class GA2
{
    // u=a.e1+b.e2
    // v=c.e1+d.e2
    // uv=u.v + u∧v
    // uv=(ac+bd)+(ad-bc).(e1∧e2)
    // e1e1=e1.e1+e1∧e1=1
    // e1e2=-e2e1
    // (e1e2)^2=e1e2e1e2=-e2e1e1e2=-1
    // let just write e1∧e2=I 


    constructor()
    {

        // basis for G(R2)={1,e1,e2,e1e2}
        // so a vector always has dim 4
        

    }

    add(v,w){
        // returns a new point
       const p=[0,0,0,0];
        for(let i=0;i<4;i++)
        {
            p[i]=v[i]+w[i];
        }
        return p;
        
    }
    gaproduct(v,w)
    {
        // geometric product of 2 vectors

        const p=[0,0,0,0];

        /// multiplication table
        //      ¦ 1    ¦ e1   ¦ e2   ¦ e1e2
        //-----------------------------------
        // 1    ¦ 1    ¦ e1   ¦ e2   ¦ e1e2
        // e1   ¦ e1   ¦ 1    ¦ e1e2 ¦ e2
        // e2   ¦ e2   ¦ e2e1 ¦ 1    ¦ -e1
        // e1e2 ¦ e1e2 ¦ -e2  ¦ e1   ¦  -1

        p[0]=v[0]*w[0]+v[1]*w[1]+v[2]*w[2]-v[3]*w[3];

        p[1]=v[1]*w[0]+v[0]*w[1]+v[3]*w[2]-v[2]*w[3];

        p[2]=v[0]*w[2]+v[1]*w[3]+v[2]*w[0]-v[3]*w[1];

        p[3]=v[0]*w[3]+v[1]*w[2]-v[2]*w[1]+v[3]*w[0];

        return this.ROUND(p);
    }
    
    multiply(...vectors)
    {   
        // multiply all the vectors in vectors in the order from left to right
        const p=[1,0,0,0];
        var k=vectors.reduce((p,v)=>this.gaproduct(p,v),p); // for each v in vectors multiply with the next
        return k;
    }

    conjugate(v)
    {
        return [v[0],v[1],v[2],-v[3]];
    }


    inv(w)
    {
        // geometric product with itsellf
        // suppose we have a vector u
        // the geometric product uu=u.u+u^u, since u^u=0
        // the value of uu=u^2 which is the scalar part of the vector
        const p=this.gaproduct(w,this.conjugate(w));
        let uumag=p[0];
        

        p[0]=w[0]*(1/uumag);
        p[1]=w[1]*(1/uumag);
        p[2]=w[2]*(1/uumag);
        p[3]=w[3]*-(1/uumag);

        return this.ROUND(p);   
        
        
    }

    reflect(u,v)
    {
        // reflection of u in the v
        // u`=(vu)inv(v) geometric product
        return this.multiply(v,u,this.inv(v));
    }

    rotate(u,deg,dir)
    {
        
    // rotation is in e1^e2 then dir=1 
    // rotation is in e2^e1 then dir=-1
    
    // rotation in GA is a double reflection
    // take 2 vectors in the plane
    let ang=(0.5*deg*Math.PI/180);   
    /// the angle between the 2 vectors should be theta/2
    /// the magnitude of each vector should be 1
    /// let the vectors be v and w
    // set v=[0,1,0,0] and w=[0,x,y,0]
    // geometric product vw=(e1)*(xe1+ye2)
    // vw=x+ye1e2 if dir in e1e2 or vw=x-ye1e2 if dir is in e2e1
    // vw=¦v¦¦w¦cos(theta/2)+¦v¦w¦sin(theta/2)
    // since ¦v¦=1, ¦w¦=1
    // x=cos(theta/2),y=sin(theta/2)*dir

    let v=[0,1,0,0];
    let w=[0,Math.cos(ang),dir*Math.sin(ang),0];

    // rotation is a double reflection first in v and then in w
    // u'=inv(w)inv(v)u(v)(w)=inv(R)u(R)
    //where R is the rotor
    let R=this.multiply(v,w);
    console.log("the rotor is "+ R);
    console.log("the inverse of the rotor is "+this.inv(R));
    console.log("R*inv(R)"+this.multiply(R,this.inv(R)));

    //return this.reflect(this.reflect(u,v),w); one way
    return this.multiply(this.inv(R),u,R);


        
    }

    ROUND(p)
    {
        for(let i=0;i<4;i++)
        {
            p[i]=0.0001*Math.round(p[i]*10000); // to display to 4 s.f need to be reworked
        }
        return p;
    }

    
}