import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth.service';

// Custom validator for password confirmation
function passwordMatchValidator(control: AbstractControl) {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-reset-password-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password-form.component.html',
  styleUrl: './res
}  }   }
};
 '0%' idth: r: '', w, colo ''ngth:turn { stre        re  default:
};
    : '100%' width34a', '#16a', color: Strong: 'gthren return { st   :
    ase 5  c0%' };
    width: '85e', 22c5or: '#'Good', col strength: urn {
        ret    case 4:
   };h: '60%'b308', widtor: '#ea colr',ai: 'F { strength   return  
   se 3:;
      ca'40%' }6', width: : '#f9731 colorgth: 'Weak', { strenurn      retse 2:
  };
      ca: '20%' , width444'olor: '#ef4k', c'Very Weah: rn { strengt      retuse 1:
    ca     case 0:

     ore) {  switch (sc+;
    
  ord)) score+.test(passw/[@$!%*?&]/
    if (core++;sword)) stest(pasf (/\d/. icore++;
   )) sasswordest(pf (/[A-Z]/.tre++;
    ird)) sco.test(passwo[a-z]/  if (/+;
  score+ngth >= 8) assword.le (p    if    
score = 0;
  let e || '';
  l?.valurdContro.passwohisrd = twonst pass } {
    costringdth: string; wir: ing; coloh: strstrengt{ Strength(): getPassword
  }

  urn '';  
    ret }
  
   h';o not matcords dswurn 'Pas
      ret?.touched) {&& controlismatch'] ordMassws?.['prrorwordForm.e.resetPass && thisPassword'onfirm== 'came =ieldN(fvel
    if form leat  mismatch swordck for pasChe   
    // }
 r';
    l characte and speciambere, nuercaslowcase, ain upperrd must contswon 'Paseturtern']) r['patol.errors (contr   if;
   racters`h} chauiredLengtength'].reqrrors['minl ${control.eat leastd must be rn `Passworngth']) retuleminol.errors['if (contr   
   ;d`ire requame} is{fieldN`$eturn uired']) rreqs['rrorl.e(controf  {
      itouched) && control.?.errorsf (control   idName);
 ielt(fdForm.gesworas this.resetPst control =   cong {
 ring): strinieldName: stldError(f
  getFie }
);
 
    }uched();rkAsTotrol?.ma
      conet(key);orm.gsetPasswordFhis.retrol = ton   const c
   => {h(key rols).forEacdForm.contsetPassworkeys(this.rect.    Obje {
ched()mGroupTouarkFor  private m;
  }

uth/login'])gate(['/a.router.navi {
    thisn()LoginBackTo  o;
  }

  }) }
       }
     );
   .'try againse ord. Pleaet passwed to resage || 'Failssor?.meset(err.errrorMessage..er   this{
       else    }      ken.');
et toresired d or expInvaliessage.set('s.errorMthi      {
      === 400) (err.status      if);
  ng.set(falseloadi     this. => {
    any)rror: (err:},
      e    
  00);      }, 30
  ]);/login'(['/authvigatenater.ou  this.r       
 ut(() => { setTimeo  s
     ndr 3 secologin afteedirect to / R     /       
   sword.');
 w paswith your neog in u can now let. Yo resessfullyucceen srd has bur passwo.set('YossMessagehis.succe      tfalse);
  ding.set(is.loa   th  
   xt: () => { nee({
     scrib.subrd) passwoToken(),(this.resetrdesetPasswovice.rs.authSer   thi

 ge.set('');Messauccess    this.s);
''sage.set(rorMesis.er
    thtrue);set(ading.    this.lo
m.value;PasswordFor.resetisd } = thswor const { pas    }

   ;
urnret      n.');
t toked reseet('Invali.srMessage  this.erro {
    ))Token(ethis.res
    if (!t  }
  turn;

      reouched();FormGroupTrkma     this.lid) {
 nvarm.iordFos.resetPasswf (thi   i() {
 mit  onSub

ord());
  }nfirmPasswthis.showCoset(!rmPassword.wConfi  this.shoy() {
  litordVisibiPasswonfirm

  toggleC());
  }swordwPasshod.set(!this.sworowPassh this.() {
   dVisibilityogglePasswor; }

  td')nfirmPasswororm.get('coetPasswordFes.rurn this) { retl(ordControswirmPasconf  get }
password'); t('dForm.gePassworesetis.r { return throl()ntasswordCot p
  ge });
  }
     }
   
 oken.');et ting resor misslid Invae.set('rorMessag     this.er {
     } else
    .set(token);Token  this.reset
      oken) {(t   if '];
   enams['tok part token =     cons{
  => ramsribe(paParams.subsc.route.query
    thiseters paramken from URLreset toGet  //    it() {
  ngOnIn;

r })idatoalatchV: passwordMatorslidva
  }, { equired]]ators.r ['', [Validord:Passwrm   confi
 
    ]],&]/)d@$!%*?A-Za-z\%*?&])[.*[@$!?=)(*\d])(?=.(?=.*[A-Z[a-z])?=.*n(/^(s.patterator
      Validth(8),inLengValidators.m
       rs.required,alidato     V', [
 [': ssword({
    pagroups.fb.p = thi FormGrouwordForm:  resetPass

('');en = signal
  resetTokalse);d = signal(fmPassworowConfir;
  she)lsal(faignd = sworss
  showPaal('');signMessage = ;
  success') = signal('essagerrorMfalse);
  eng = signal(

  loadier);FormBuild = inject(rivate fb pe);
 Rout(Activatedctoute = injeivate rter);
  prinject(Rououter = e rprivat
  ervice);inject(AuthSe = Service auth privatonent {
 wordFormComps ResetPassport clas)
ext.scss'
}componenword-form.et-pass